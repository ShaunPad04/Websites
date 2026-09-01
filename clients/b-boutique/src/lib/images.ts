/** Generated art direction, keyed by the slot it fills.
 *
 *  Shot as one set: black marble with white veining, polished brass, a pale
 *  bone floor, warm directional window light from the left. That consistency
 *  is what makes sixteen separate generations read as one photoshoot.
 *
 *  These live on Higgsfield's CDN. That host is blocked by this sandbox's
 *  egress proxy, so the files cannot be vendored into public/ from here — but
 *  a visitor's browser fetches them directly and they render normally.
 *  `scripts/fetch-images.mjs` pulls them local when run outside the sandbox.
 *
 *  Every slot keeps its designed marble/cloth fallback underneath, so a slot
 *  that fails to load still reads as intentional rather than broken. */

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3HwrG1wTADv3RkUcvzwwuwfoAUh/";

export const images: Partial<Record<string, string>> = {
  hero: "/img/hero.png",
  "hero-mobile": "/img/hero-mobile.png",

  // Category panels — one per rail, keyed by slug so a reorder cannot
  // silently mis-pair a photograph with the wrong category.
  "panel-all":         CDN + "hf_20260901_005602_d257ff55-dc4f-40c5-bd57-f948cfbb8480.png",
  "panel-tops":        CDN + "hf_20260901_005609_b5cc1ef9-3ce9-4b5a-a591-78da88a8f43f.png",
  "panel-dresses":     CDN + "hf_20260831_213118_14e2c6f8-dcde-4c09-986b-584661bb7fb6.png",
  "panel-jackets":     CDN + "hf_20260831_213120_c83fcbf8-6a0f-4e60-806b-a8ce0a32417f.png",
  "panel-knitwear":    CDN + "hf_20260831_213122_f1b362aa-51b9-415a-87ee-792954a78c57.png",
  "panel-trousers":    CDN + "hf_20260831_213130_a30796f6-3422-4bef-9404-01110b1701da.png",
  "panel-accessories": CDN + "hf_20260831_213132_410d532a-cd67-4c29-9277-1a33348ce3c2.png",
  "panel-homeware":    CDN + "hf_20260831_213133_3cad2c02-b79d-4c6f-bb3b-865418e5192e.png",

  /* New in — one photograph per piece, keyed by slug.
   *
   * The trouser, blazer, tee and slip dress were shot 2026-09-01 as single
   * garments: the brief was a dress, a jacket, trousers and a t-shirt that
   * read as specific pieces rather than a rail or a still life. Same set as
   * the rest — black marble with white veining, polished brass, warm window
   * light from the left, 85mm — so they cut together with the originals.
   *
   * They replace the earlier linen trouser, cropped wool jacket and midi tea
   * dress, whose slugs changed with them so a name can never drift from its
   * photograph. The superseded URLs are in this file's git history. */
  "new-wool-trouser":      CDN + "hf_20260901_211245_625772ec-5bbb-414c-a36a-c0087e92624a.png",
  "new-camel-blazer":      CDN + "hf_20260901_211239_cc10350a-5a88-4247-bc86-014303508a30.png",
  "new-cotton-tee":        CDN + "hf_20260901_211251_7a3352f0-d1b5-4990-b4e5-f2791eedd1a4.png",
  "new-slip-dress":        CDN + "hf_20260901_211233_0610cafa-ecc2-4711-bacb-05061bc841ff.png",
  "new-lambswool-crew":    CDN + "hf_20260831_213144_1312c8d5-9154-4c77-9a39-380f7b328e63.png",
  "new-leather-crossbody": CDN + "hf_20260831_213223_e22ab789-2dd1-4cf5-8b64-6bd4815a9348.png",
  "new-silk-scarf":        CDN + "hf_20260831_213229_80e138d9-ece1-4d14-9d7f-c00b7603590c.png",
  "new-stoneware-carafe":  CDN + "hf_20260831_213231_6b53732f-613b-42ee-82e6-a5b400917dde.png",
  "new-boucle-overshirt":  CDN + "hf_20260831_213242_cd9f22e5-fcad-404a-9c40-ee438645bd60.png",

  // Homeware section stills
  "homeware-ceramics": CDN + "hf_20260831_213243_9282d4a4-dd92-4a5c-80a2-d2de3971bcfa.png",
  "homeware-linen":    CDN + "hf_20260831_213311_6f856f33-0b6d-4742-8fee-9f5b600b9d88.png",
};

export const imageFor = (slot?: string) => (slot ? images[slot] : undefined);
