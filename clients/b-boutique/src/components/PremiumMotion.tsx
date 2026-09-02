"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/* Scroll-craft, kept to a handful of deliberate moves.
 *
 * Every tween is a .from()/.fromTo() off the rendered state, and the whole
 * set is gated behind prefers-reduced-motion — so with JS off or motion
 * reduced, the page ships exactly as laid out. */
export function PremiumMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* The hero used to be driven from here: a masked reveal on the giant
         wordmark, plus scrubbed ScrollTriggers on the photograph. The wordmark
         is gone from the hero — it lives in the footer now — and the hero's
         drift is four CSS keyframes on a root scroll timeline, which costs no
         JavaScript and cannot fight Lenis. Nothing hero-related belongs in
         this file any more. */

      /* The philosophy statement rises line by line out of its own mask.
       *
       * Lines, not characters: the sentence is one thought and it should
       * arrive in the shapes the reader will actually read it in. GSAP's own
       * `mask: "lines"` builds the overflow wrapper, and `autoSplit` re-splits
       * on resize — without it a desktop line break freezes into the mobile
       * layout, which is the classic failure of this effect.
       *
       * `aria: "auto"` puts the original sentence on the element and hides the
       * generated line spans, so a screen reader meets the sentence once.
       *
       * once: true. It plays as the section arrives and never again; replaying
       * on every scroll direction change is what makes this pattern annoying. */
      document.querySelectorAll<HTMLElement>("[data-lines]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          aria: "auto",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 105,
              duration: 0.9,
              stagger: 0.08,
              // Closest built-in to the site's cubic-bezier(.22,1,.36,1):
              // fast departure, long settle. Not worth another plugin.
              ease: "power4.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          },
        });
      });

      // 4. Section headings set themselves, character by character. Safe to
      //    split here — none of these carry a gradient fill.
      document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        const split = new SplitText(el, { type: "chars,words", aria: "auto" });
        splits.push(split);
        gsap.from(split.chars, {
          opacity: 0,
          yPercent: 55,
          duration: 0.6,
          stagger: 0.011,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // 5. Cards and panels rise in on a short stagger as their row arrives.
      document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      splits.forEach((s) => s.revert());
      mm.revert();
    };
  }, []);

  return null;
}
