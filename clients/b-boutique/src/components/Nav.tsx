"use client";

import { useEffect, useState } from "react";
import { LocalTime } from "./LocalTime";
import { CornerMenu } from "./CornerMenu";

/* Header. Transparent over the hero photograph, solid bone once the page
   scrolls under it.
 *
 * The top centre is deliberately empty: the numbered stack that sat there is
 * gone, and nothing replaced it. The photograph is the hero, the navigation
 * is a control in the corner. */
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
      /* Above the panel (z-50) so the Menu/Close trigger stays visible and
         clickable while the menu is open — the panel reserves top padding for
         exactly this. */
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "bg-bone/90 text-onyx shadow-[0_1px_0_var(--line)] backdrop-blur-md"
          : "text-bone"
      }`}
    >
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
            <span className="display whitespace-nowrap text-lg leading-none sm:text-xl">
              B Boutique
            </span>
            <span className="hidden align-super text-[0.6rem] sm:inline">®</span>
          </a>
          <span className={`hidden sm:block ${scrolled ? "text-onyx-veil" : "text-bone/70"}`}>
            <LocalTime />
          </span>
        </div>

        <CornerMenu scrolled={scrolled} />
      </div>
    </header>
  );
}
