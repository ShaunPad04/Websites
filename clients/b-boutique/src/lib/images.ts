/** Generated art direction, keyed by the slot it fills.
 *
 *  Shot as one set: black marble with white veining, polished brass, a pale
 *  bone floor, warm directional window light from the left. That consistency
 *  is what makes twenty separate generations read as one photoshoot.
 *
 *  ── Where the files actually live ────────────────────────────────────────
 *  Until they are vendored, every slot resolves to Higgsfield's CDN. That
 *  host is denied by the Claude Code sandbox's egress policy, so inside that
 *  environment the slots fall back to their designed marble and cloth — the
 *  photographs are fine, the sandbox simply cannot reach them.
 *
 *  `node scripts/fetch-images.mjs`, run anywhere with normal internet, pulls
 *  the set into public/img as web-weight WebP and flips VENDORED to true.
 *  Nothing else has to change: SlotPhoto already routes a local path through
 *  next/image, which adds AVIF and a srcset on top.
 *
 *  The CDN filenames stay in this file either way, so a vendored copy can
 *  always be traced back to the generation it came from — and re-fetched.
 *
 *  Every slot keeps its designed fallback underneath regardless, so a slot
 *  that fails to load still reads as intentional rather than broken. */

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3HwrG1wTADv3RkUcvzwwuwfoAUh/";

/** Flipped to true by scripts/fetch-images.mjs once public/img holds the set.
 *  A boolean beats rewriting each URL in this file by hand or by regex: the
 *  provenance below survives, and reverting is one character. */
export const VENDORED = false;

/** slot -> the generation's filename on the CDN. Order is the page's order. */
const shot: Record<string, string> = {
  // Category panels — one per rail, keyed by slug so a reorder cannot
  // silently mis-pair a photograph with the wrong category.
  "panel-all":         "hf_20260901_005602_d257ff55-dc4f-40c5-bd57-f948cfbb8480.png",
  "panel-tops":        "hf_20260901_005609_b5cc1ef9-3ce9-4b5a-a591-78da88a8f43f.png",
  "panel-dresses":     "hf_20260831_213118_14e2c6f8-dcde-4c09-986b-584661bb7fb6.png",
  "panel-jackets":     "hf_20260831_213120_c83fcbf8-6a0f-4e60-806b-a8ce0a32417f.png",
  "panel-knitwear":    "hf_20260831_213122_f1b362aa-51b9-415a-87ee-792954a78c57.png",
  "panel-trousers":    "hf_20260831_213130_a30796f6-3422-4bef-9404-01110b1701da.png",
  "panel-accessories": "hf_20260831_213132_410d532a-cd67-4c29-9277-1a33348ce3c2.png",
  "panel-homeware":    "hf_20260831_213133_3cad2c02-b79d-4c6f-bb3b-865418e5192e.png",

  /* New in — one photograph per piece.
   *
   * The trouser, blazer, tee and slip dress were shot 2026-09-01 as single
   * garments: the brief was a dress, a jacket, trousers and a t-shirt that
   * read as specific pieces rather than a rail or a still life. Same set as
   * the rest, so they cut together with the originals. */
  "new-wool-trouser":      "hf_20260901_211245_625772ec-5bbb-414c-a36a-c0087e92624a.png",
  "new-camel-blazer":      "hf_20260901_211239_cc10350a-5a88-4247-bc86-014303508a30.png",
  "new-cotton-tee":        "hf_20260901_211251_7a3352f0-d1b5-4990-b4e5-f2791eedd1a4.png",
  "new-slip-dress":        "hf_20260901_211233_0610cafa-ecc2-4711-bacb-05061bc841ff.png",
  "new-lambswool-crew":    "hf_20260831_213144_1312c8d5-9154-4c77-9a39-380f7b328e63.png",
  "new-leather-crossbody": "hf_20260831_213223_e22ab789-2dd1-4cf5-8b64-6bd4815a9348.png",
  "new-silk-scarf":        "hf_20260831_213229_80e138d9-ece1-4d14-9d7f-c00b7603590c.png",
  "new-stoneware-carafe":  "hf_20260831_213231_6b53732f-613b-42ee-82e6-a5b400917dde.png",
  "new-boucle-overshirt":  "hf_20260831_213242_cd9f22e5-fcad-404a-9c40-ee438645bd60.png",

  // Homeware section stills
  "homeware-ceramics": "hf_20260831_213243_9282d4a4-dd92-4a5c-80a2-d2de3971bcfa.png",
  "homeware-linen":    "hf_20260831_213311_6f856f33-0b6d-4742-8fee-9f5b600b9d88.png",
};

/* The hero is not in here. It is vendored already, at its own responsive
 * sizes, and HeroPicture names those files directly — the two "hero" entries
 * this map used to carry pointed at /img/hero.png and /img/hero-mobile.png,
 * neither of which exists. Nothing read them; they were dead config. */

export const images: Partial<Record<string, string>> = Object.fromEntries(
  Object.entries(shot).map(([slot, file]) => [
    slot,
    VENDORED ? `/img/${slot}.webp` : CDN + file,
  ]),
);

/** The CDN original for a slot, whatever `images` currently resolves to.
 *  scripts/fetch-images.mjs downloads from here. */
export const sourceFor = (slot: string) =>
  shot[slot] ? CDN + shot[slot] : undefined;

export const slots = Object.keys(shot);

export const imageFor = (slot?: string) => (slot ? images[slot] : undefined);
