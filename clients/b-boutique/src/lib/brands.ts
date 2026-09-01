/** Brands shown on the homepage rail.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  TEMPORARY — CLIENT CONCEPT ONLY. NOT CONFIRMED STOCKISTS.
 *
 *  These are real-world labels used as placeholders in a demo for the client.
 *  They are NOT confirmed B Boutique stockists, partners or endorsers, and
 *  the client will confirm or replace this list before production launch.
 *
 *  This module is deliberately isolated from `shop.ts`. The JSON-LD in
 *  layout.tsx is generated from `shop` and `hours` alone, so nothing here can
 *  reach structured data, metadata, the page description or marketing copy.
 *  Keep it that way: do not import `brands` into layout.tsx or shop.ts, and do
 *  not write alt text that asserts a stocking relationship.
 *  ─────────────────────────────────────────────────────────────────────────
 */

export type Brand = {
  /** The label's own name. Used as the accessible name, never as a claim. */
  name: string;
  /** Path to an official wordmark vendored into public/img/brands/.
   *  Absent means no asset has been supplied yet, and the rail falls back to
   *  a plain typeset stand-in that is deliberately not a facsimile of the
   *  real mark — see BrandRail. Never redraw or approximate a trademark. */
  src?: string;
  /** Optical height in px at desktop; the rail scales this down on mobile.
   *  Tuned per mark rather than set globally: a compact stacked logo and a
   *  long thin wordmark set to the same pixel height do not read as the same
   *  visual weight. Only meaningful once `src` is present. */
  opticalHeight?: number;
};

export const brands: Brand[] = [
  { name: "Mos Mosh",       opticalHeight: 26 },
  { name: "Rino & Pelle",   opticalHeight: 28 },
  { name: "Part Two",       opticalHeight: 24 },
  { name: "b.young",        opticalHeight: 27 },
  { name: "Ichi",           opticalHeight: 30 },
  { name: "Nümph",          opticalHeight: 29 },
  { name: "Saint Tropez",   opticalHeight: 25 },
  { name: "Selected Femme", opticalHeight: 23 },
];
