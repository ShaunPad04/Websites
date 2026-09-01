"use client";

import { useEffect, useState } from "react";
import { LocalTime } from "./LocalTime";
import { ArrowButton } from "./ArrowButton";
import { NavStack } from "./NavStack";

/* Header. Transparent over the hero photograph, solid bone once the page
   scrolls under it — one nav style that swaps on scroll, rather than
   per-section colour detection, which reads as a glitch.
 *
 * The stack sits left of centre rather than mathematically centred: at
 * desktop widths the model's face and hand occupy the middle third of the
 * frame, and a centred nav lands directly on her eye. Sitting it beside the
 * clock keeps it over the plain red field on the left. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-bone/90 text-onyx shadow-[0_1px_0_var(--line)] backdrop-blur-md"
          : "text-bone"
      }`}
    >
      {/* A soft band under the header while it is transparent. Without it the
          nav sits on whatever the photograph happens to be doing, and the
          recessive rows cannot hold 4.5:1. Fades out by 140px so the hero
          composition is untouched. */}
      {!scrolled ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[140px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(42,2,5,.64) 0%, rgba(42,2,5,.34) 45%, transparent 100%)",
          }}
        />
      ) : null}

      <div className="relative mx-auto flex max-w-[100rem] items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6 lg:gap-12">
          <a href="#top" className="flex items-baseline gap-1" aria-label="B Boutique, home">
            <span className="display text-lg leading-none sm:text-xl">B Boutique</span>
            <span className="hidden align-super text-[0.6rem] sm:inline">®</span>
          </a>
          <span
            className={`hidden sm:block ${scrolled ? "text-onyx-veil" : "text-bone/70"}`}
          >
            <LocalTime />
          </span>

          {/* Left of centre, clear of her face. Exactly one instance: two
              would put two aria-current elements in the accessibility tree,
              since a CSS-hidden nav is still exposed to it. */}
          <NavStack scrolled={scrolled} />
        </div>

        <div className="flex items-center gap-2">
          <ArrowButton href="#visit" tone={scrolled ? "dark" : "light"}>
            Find us
          </ArrowButton>
        </div>
      </div>
    </header>
  );
}
