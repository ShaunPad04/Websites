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

      // 2. The photograph drifts slower than the page.
      const heroImg = document.querySelector<HTMLElement>("[data-parallax-hero]");
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: -9,
          ease: "none",
          scrollTrigger: { trigger: heroImg, start: "top top", end: "bottom top", scrub: 1 },
        });
      }

      // 3. The wordmark lifts and fades as the hero leaves, so the section
      //    below arrives over it rather than shunting it off screen.
      if (mask) {
        gsap.to(mask, {
          yPercent: -30,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: { trigger: mask, start: "bottom bottom", end: "bottom top", scrub: 1 },
        });
      }

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
