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
   *  client; never redrawn, traced, cropped or approximated here. */
  src: string;

  /* ── Ink geometry ──────────────────────────────────────────────────────
     Every number below is measured off the real file by rasterising it and
     trimming to the ink, then normalised against the ink's own height.

     The slot is built to the INK, not to the file box, because the two are
     rarely the same: mos-mosh is 73% transparent padding, ichi and numph
     about 25%, and three assets are not even centred inside their own box.
     Sizing by file box would render those marks small and sitting off to one
     side, and mos-mosh would need a 100px-tall slot to show a 25px wordmark,
     blowing the section height.

     So the slot is exactly the ink, and the mask is scaled and offset so the
     artwork's ink lands inside it. The file is never modified and nothing is
     stretched or cropped — the padding simply falls outside the slot, and
     being transparent it was never visible anyway. */

  /** Ink width ÷ ink height. */
  iw: number;
  /** Full asset width and height, over ink height — the mask's scale. */
  mw: number;
  mh: number;
  /** Ink's left/top inset within the asset, over ink height — the mask's
   *  offset, so off-centre artwork still lands square in its slot. */
  ox: number;
  oy: number;

  /** Target ink height in px at desktop — the measurement that should look
   *  even along the row. Set by eye from the rendered row, not by formula,
   *  because equal ink height is not equal optical weight: ICHI is a heavy
   *  bold and needs markedly less height than the thin serifs beside it,
   *  while Saint Tropez stacks two lines and needs more or it reads small.
   *  Re-judge these against a screenshot whenever an asset changes. */
  cap: number;
};

export const brands: Brand[] = [
  { name: "Mos Mosh",       src: "/img/brands/mos-mosh.png",     iw: 5.9068,  mw: 10,      mh: 3.7267, ox: 2.0497, oy: 1.3665, cap: 22 },
  { name: "Rino & Pelle",   src: "/img/brands/rino-pelle.svg",   iw: 12.8141, mw: 12.8141, mh: 1.0050, ox: 0,      oy: 0,      cap: 23 },
  { name: "Part Two",       src: "/img/brands/part-two.png",     iw: 9.1783,  mw: 9.1783,  mh: 1,      ox: 0,      oy: 0,      cap: 24 },
  { name: "b.young",        src: "/img/brands/byoung.svg",       iw: 4.6383,  mw: 4.6383,  mh: 1,      ox: 0,      oy: 0,      cap: 26 },
  { name: "Ichi",           src: "/img/brands/ichi.avif",        iw: 3.2661,  mw: 3.8337,  mh: 1.3304, ox: 0.3503, oy: 0.1508, cap: 22 },
  { name: "Nümph",          src: "/img/brands/numph.png",        iw: 3.6476,  mw: 4.5881,  mh: 1.3216, ox: 0.4714, oy: 0.1498, cap: 25 },
  { name: "Saint Tropez",   src: "/img/brands/saint-tropez.svg", iw: 2.0918,  mw: 2.2838,  mh: 1.0017, ox: 0.0968, oy: 0.0017, cap: 32 },
  { name: "Selected Femme", src: "/img/brands/selected.svg",     iw: 5.2117,  mw: 5.25,    mh: 1,      ox: 0,      oy: 0,      cap: 23 },
];
