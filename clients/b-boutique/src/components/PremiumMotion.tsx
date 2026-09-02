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
