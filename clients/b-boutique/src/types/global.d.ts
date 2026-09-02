import type Lenis from "lenis";

declare global {
  interface Window {
    /** Set by SmoothScroll so an overlay can stop and restart the smooth
     *  scroller. Undefined before mount and after unmount — always guard. */
    __lenis?: Lenis;
  }
}

export {};
