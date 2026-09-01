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
 * then flips VENDORED in src/lib/images.ts, which is all it takes to point the
 * site at the local copies. SlotPhoto already routes a local path through
 * next/image, so AVIF and a per-breakpoint srcset come for free on top.
 *
 * The originals are 3456x4608 PNGs at roughly 8MB each. Committing twenty of
 * those would put ~175MB of source art in the repo to serve slots that are at
 * most ~600 CSS px wide. MAX_W is 2x the largest slot, which is the most any
 * display can use. */
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import sharp from "sharp";
import { slots, sourceFor, VENDORED } from "../src/lib/images.ts";

const MAX_W = 1600;      // 2x the widest slot on the page, and no more
const QUALITY = 88;      // visually lossless at this scale; next/image re-encodes down
const MANIFEST = "src/lib/images.ts";
const force = process.argv.includes("--force");

const kb = (n) => (n / 1024).toFixed(0).padStart(4) + " KB";

async function download(url, attempt = 1) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (attempt >= 4) throw err;
    await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
    return download(url, attempt + 1);
  }
}

await mkdir("public/img", { recursive: true });

let done = 0, skipped = 0, failed = 0, bytesIn = 0, bytesOut = 0;

for (const slot of slots) {
  const out = `public/img/${slot}.webp`;
  if (!force && (await stat(out).catch(() => null))) {
    console.log(`  ${slot.padEnd(24)} skipped (exists)`);
    skipped++;
    continue;
  }
  process.stdout.write(`  ${slot.padEnd(24)} `);
  try {
    const raw = await download(sourceFor(slot));
    const buf = await sharp(raw)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    await writeFile(out, buf);
    const { width, height } = await sharp(buf).metadata();
    console.log(`${kb(raw.length)} -> ${kb(buf.length)}  ${width}x${height}`);
    bytesIn += raw.length; bytesOut += buf.length; done++;
  } catch (err) {
    console.log(`FAILED — ${err.message}`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} slot(s) failed. VENDORED left as-is so the site keeps`);
  console.error(`using the CDN rather than pointing at files that are not there.`);
  process.exit(1);
}

if (done + skipped === slots.length) {
  const src = await readFile(MANIFEST, "utf8");
  const flipped = src.replace(
    /export const VENDORED = (?:true|false);/,
    "export const VENDORED = true;",
  );
  if (flipped === src && !VENDORED) {
    console.error(`\nCould not find the VENDORED line in ${MANIFEST}; set it by hand.`);
    process.exit(1);
  }
  await writeFile(MANIFEST, flipped);
}

console.log(
  `\n${done} fetched, ${skipped} already present.` +
    (done ? `  ${kb(bytesIn)} of source -> ${kb(bytesOut)} shipped.` : ""),
);
console.log(`${MANIFEST}: VENDORED = true. Run \`pnpm build\` and the slots fill in.`);
