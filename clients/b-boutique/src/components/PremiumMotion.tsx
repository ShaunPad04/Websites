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
      // 1. The wordmark rises out of its own mask. Not SplitText: splitting
      //    would give each character its own background-clip box and shatter
      //    the single chrome sweep across the word.
      const mask = document.querySelector<HTMLElement>("[data-mask]");
      const word = mask?.querySelector("h1");
      if (word) {
        gsap.from(word, {
          yPercent: 108,
          duration: 1.25,
          ease: "expo.out",
          delay: 0.15,
        });
      }

      /* 2 and 3 — the hero photograph parallax and the wordmark lift — used
         to live here as scrubbed ScrollTriggers on [data-parallax-hero] and
         [data-mask]. The hero now drives both from its own scroll progress
         with Motion values, and two systems writing transforms to the same
         nodes would fight. GSAP keeps the entry reveal above, which runs on
         the h1 while Motion drives its wrapper. */

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
