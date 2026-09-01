#!/usr/bin/env node
/* Pre-encode the hero art.
 *
 * The Next image optimiser encodes on demand: the first request for the
 * 2.8 MB source PNG cost 1351ms, which landed directly on LCP. Encoding
 * ahead of time removes that entirely — the browser gets a finished file
 * from the static route.
 *
 * Two crops, three formats each, so a <picture> can hand every browser the
 * smallest thing it understands and fetch exactly one file.
 *
 *   node scripts/build-hero.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/img", { recursive: true });

const jobs = [
  { src: "assets/hero-desktop-source.png", out: "hero-desktop", width: 1800 },
  { src: "assets/hero-mobile-source.png", out: "hero-mobile", width: 1100 },
];

for (const { src, out, width } of jobs) {
  const base = sharp(src).resize({ width, withoutEnlargement: true });
  const meta = await sharp(src).metadata();
  const results = await Promise.all([
    base.clone().avif({ quality: 62, effort: 6 }).toFile(`public/img/${out}.avif`),
    base.clone().webp({ quality: 78 }).toFile(`public/img/${out}.webp`),
    base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`public/img/${out}.jpg`),
  ]);
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(
    `${out}  source ${meta.width}x${meta.height} -> ${results[0].width}x${results[0].height}  ` +
      `avif ${kb(results[0].size)} · webp ${kb(results[1].size)} · jpg ${kb(results[2].size)}`,
  );
}
