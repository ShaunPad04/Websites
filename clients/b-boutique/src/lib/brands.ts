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
  /** Official wordmark vendored into public/img/brands/. Supplied by the
   *  client; never redrawn, traced or approximated here. */
  src: string;

  /* ── Geometry, measured from the files rather than declared ────────────
     Every value below was read off the actual asset by rasterising it and
     trimming to the ink, because the file box and the artwork inside it are
     not the same thing. See `cap` and `inkFraction`. */

  /** Intrinsic width ÷ height of the asset box. The mark's slot is built to
   *  exactly this, so `mask-size: contain` fills it with no letterboxing and
   *  the native aspect ratio survives untouched. */
  ratio: number;
  /** How much of the asset box height is actually ink. numph.png and
   *  ichi.avif ship with ~25% vertical padding; the other six are edge to
   *  edge. Without this correction those two render a quarter smaller than
   *  everything else — a file artefact, not a design decision. The slot is
   *  scaled up by 1/inkFraction so the *ink* lands on `cap`. */
  inkFraction: number;
  /** Target ink height in px at desktop — the measurement that should look
   *  even along the row. These are set by eye from the rendered row, not by
   *  formula, because equal ink height is not equal optical weight: ICHI is a
   *  heavy bold and needs markedly less height than the thin serifs beside
   *  it, while Saint Tropez stacks two lines and needs more or its wordmark
   *  reads small. Re-judge these against a screenshot if an asset changes. */
  cap: number;
};

export const brands: Brand[] = [
  { name: "Mos Mosh",       src: "/img/brands/mos-mosh.svg",     ratio: 3.052,  inkFraction: 1,      cap: 28 },
  { name: "Rino & Pelle",   src: "/img/brands/rino-pelle.svg",   ratio: 12.750, inkFraction: 0.995,  cap: 23 },
  { name: "Part Two",       src: "/img/brands/part-two.png",     ratio: 9.178,  inkFraction: 1,      cap: 24 },
  { name: "b.young",        src: "/img/brands/byoung.svg",       ratio: 4.637,  inkFraction: 1,      cap: 26 },
  { name: "Ichi",           src: "/img/brands/ichi.avif",        ratio: 2.881,  inkFraction: 0.7525, cap: 22 },
  { name: "Nümph",          src: "/img/brands/numph.png",        ratio: 3.472,  inkFraction: 0.7625, cap: 25 },
  { name: "Saint Tropez",   src: "/img/brands/saint-tropez.svg", ratio: 2.280,  inkFraction: 1,      cap: 32 },
  { name: "Selected Femme", src: "/img/brands/selected.svg",     ratio: 5.250,  inkFraction: 1,      cap: 23 },
];

/** Slot size for a mark: scale the box so the ink lands on `cap`, then take
 *  the width from the asset's own ratio. Nothing is stretched or cropped —
 *  the slot is simply built to fit the artwork. */
export function slotFor(b: Brand) {
  const height = b.cap / b.inkFraction;
  return { height, width: height * b.ratio };
}
