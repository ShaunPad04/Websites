#!/usr/bin/env node
/* Vendor the generated art into public/img.
 *
 *   node scripts/fetch-images.mjs            # fetch what is missing
 *   node scripts/fetch-images.mjs --force    # re-fetch everything
 *
 * Run this anywhere with normal internet. It will NOT work inside the Claude
 * Code sandbox: that environment's egress policy denies the Higgsfield CDN,
 * which is the whole reason the URLs are remote to begin with.
 *
 * What it does, per slot:
 *   download the generation -> resize to MAX_W -> WebP -> public/img/<slot>.webp
 * then rewrites the `vendored` set in src/lib/images.ts from whatever is
 * actually on disk, which is all it takes to point the site at the local
 * copies. SlotPhoto already routes a local path through next/image, so AVIF
 * and a per-breakpoint srcset come for free on top.
 *
 * The originals are 3456x4608 PNGs at roughly 8MB each. Committing twenty of
 * those would put ~175MB of source art in the repo to serve slots that are at
 * most ~600 CSS px wide. MAX_W is 2x the largest slot, which is the most any
 * display can use. */
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import sharp from "sharp";
import { slots, sourceFor } from "../src/lib/images.ts";

const MAX_W = 1600;      // 2x the widest slot on the page, and no more
const QUALITY = 88;      // visually lossless at this scale; next/image re-encodes down
const CONCURRENCY = 4;   // 19 files of ~8MB each; serial is a needlessly long wait
const MANIFEST = "src/lib/images.ts";
const force = process.argv.includes("--force");

const kb = (n) => (n / 1024).toFixed(0).padStart(4) + " KB";

/** A 4xx is the server telling you the answer will not change — a blocked
 *  host, a dead URL, an expired signature. Retrying it four times with backoff
 *  just multiplies the wait before the same failure: 19 slots against a
 *  blocking proxy took ten minutes to report what the first response said. */
class Permanent extends Error {}

async function download(url, attempt = 1) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (res.status >= 400 && res.status < 500) throw new Permanent(`HTTP ${res.status}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (err instanceof Permanent || attempt >= 3) throw err;
    await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
    return download(url, attempt + 1);
  }
}

/** Run `worker` over `items`, at most `limit` in flight. */
async function pool(items, limit, worker) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.min(limit, queue.length) }, async () => {
      while (queue.length) await worker(queue.shift());
    }),
  );
}

await mkdir("public/img", { recursive: true });

let done = 0, skipped = 0, failed = 0, bytesIn = 0, bytesOut = 0;
const errors = [];

// One line per slot, written whole: with work in flight, a half-written line
// would interleave with another slot's result.
await pool(slots, CONCURRENCY, async (slot) => {
  const out = `public/img/${slot}.webp`;
  if (!force && (await stat(out).catch(() => null))) {
    console.log(`  ${slot.padEnd(24)} skipped (exists)`);
    skipped++;
    return;
  }
  try {
    const raw = await download(sourceFor(slot));
    const buf = await sharp(raw)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    await writeFile(out, buf);
    const { width, height } = await sharp(buf).metadata();
    console.log(`  ${slot.padEnd(24)} ${kb(raw.length)} -> ${kb(buf.length)}  ${width}x${height}`);
    bytesIn += raw.length; bytesOut += buf.length; done++;
  } catch (err) {
    console.log(`  ${slot.padEnd(24)} FAILED — ${err.message}`);
    errors.push(err.message);
    failed++;
  }
});

if (failed) {
  console.error(`\n${failed} slot(s) failed.`);
  if (errors.some((e) => e.includes("403"))) {
    console.error(`\nEvery failure is a 403. That is the egress policy of wherever this`);
    console.error(`ran, not a bad URL — the Claude Code sandbox denies this CDN. Run it`);
    console.error(`from a machine with ordinary internet access.`);
  }
}

/* Rewrite the vendored set from what is on disk rather than from what this
 * run happened to fetch. Idempotent, and it cannot claim a slot is local when
 * its file is missing — which is the one way this file could lie. */
const present = [];
for (const slot of slots) {
  if (await stat(`public/img/${slot}.webp`).catch(() => null)) present.push(slot);
}
const src = await readFile(MANIFEST, "utf8");
const list = present.map((s) => `  "${s}",`).join("\n");
const next = src.replace(
  /const vendored = new Set<string>\(\n[\s\S]*?\n\);/,
  `const vendored = new Set<string>([\n${list}\n]);`,
);
if (next === src) {
  console.error(`\nCould not find the vendored set in ${MANIFEST}; update it by hand.`);
  process.exit(1);
}
await writeFile(MANIFEST, next);
console.log(`\n${present.length}/${slots.length} slots now vendored in public/img.`);
if (failed) process.exit(1);

console.log(
  `\n${done} fetched, ${skipped} already present.` +
    (done ? `  ${kb(bytesIn)} of source -> ${kb(bytesOut)} shipped.` : ""),
);
console.log(`${MANIFEST} updated. Run \`pnpm build\` and the slots fill in.`);
