"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/* The signature motion. Three moves only — a page that animates everything
   animates nothing.
     1. The headline sets itself, character by character.
     2. The hero image drifts against the scroll.
     3. The marble section parallaxes behind the panels.
   Everything else is handled by the one-shot Reveal observer.

   Nothing here is required to read the page: GSAP `.from()` tweens start
   from the rendered state, so with JS disabled or reduced-motion set, the
   final layout is what ships. */
export function PremiumMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const mm = gsap.matchMedia();
    let split: SplitText | null = null;

    mm.add(
      {
        motionOK: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { motionOK } = ctx.conditions as { motionOK: boolean };
        if (!motionOK) return;

        const headline = document.querySelector<HTMLElement>("[data-split]");
        if (headline) {
          // aria:"auto" keeps the heading readable as one string to screen
          // readers instead of spelling out every character.
          split = new SplitText(headline, { type: "chars,words", aria: "auto" });
          gsap.from(split.chars, {
            opacity: 0,
            yPercent: 60,
            rotateX: -55,
            duration: 0.75,
            stagger: 0.012,
            ease: "expo.out",
            delay: 0.12,
          });
        }

        // The hero image drifts slower than the page — depth, not decoration.
        const heroImg = document.querySelector<HTMLElement>("[data-parallax-hero]");
        if (heroImg) {
          gsap.to(heroImg, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: heroImg,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        // Marble drifts behind the rails so the panels feel like they sit
        // in front of a wall rather than on a flat colour.
        const marble = document.querySelector<HTMLElement>("[data-parallax-marble]");
        if (marble) {
          gsap.fromTo(
            marble,
            { backgroundPositionY: "0%" },
            {
              backgroundPositionY: "18%",
              ease: "none",
              scrollTrigger: {
                trigger: marble,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          );
        }
      },
    );

    // Fonts and images change layout height; without this the triggers
    // fire at the wrong scroll positions.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      split?.revert();
      mm.revert();
    };
  }, []);

  return null;
}
