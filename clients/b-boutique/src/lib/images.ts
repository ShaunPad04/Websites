/** Generated art direction, keyed by the slot it fills.
 *
 *  These live on Higgsfield's CDN. That host is blocked by this sandbox's
 *  egress proxy, so the files cannot be vendored into public/ from here —
 *  but a visitor's browser fetches them directly and they render normally.
 *  `scripts/fetch-images.mjs` pulls them local when run outside the sandbox.
 *
 *  Every slot keeps its designed marble/cloth fallback underneath, so a slot
 *  with no image yet — or one that fails to load — still reads as intentional
 *  rather than broken. */

export const images: Partial<Record<string, string>> = {
  hero: "https://d8j0ntlcm91z4.cloudfront.net/user_3HwrG1wTADv3RkUcvzwwuwfoAUh/hf_20260831_211507_7e45c146-8ff2-4d82-aa47-3eddc7c93ae8.png",
};

export const imageFor = (slot?: string) => (slot ? images[slot] : undefined);
