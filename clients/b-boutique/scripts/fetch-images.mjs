#!/usr/bin/env node
/* Vendor the generated art into public/img and rewrite src/lib/images.ts to
 * local paths. Run this OUTSIDE the Claude Code sandbox — that environment's
 * egress proxy denies the Higgsfield CDN, which is why the URLs are remote in
 * the first place.
 *
 *   node scripts/fetch-images.mjs
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { images } from "../src/lib/images.ts";

await mkdir("public/img", { recursive: true });

let manifest = await readFile("src/lib/images.ts", "utf8");
let count = 0;

for (const [slot, url] of Object.entries(images)) {
  if (!url || url.startsWith("/")) continue;
  const ext = new URL(url).pathname.split(".").pop() ?? "png";
  const file = `public/img/${slot}.${ext}`;
  process.stdout.write(`  ${slot} … `);
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`FAILED ${res.status}`);
    continue;
  }
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  manifest = manifest.replace(url, `/img/${slot}.${ext}`);
  console.log(`-> ${file}`);
  count++;
}

await writeFile("src/lib/images.ts", manifest);
console.log(`\n${count} image(s) vendored; src/lib/images.ts now points at /img/.`);
console.log("Swap ImageSlot's <img> for next/image afterwards for automatic AVIF/WebP.");
