"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#rails", label: "The rails" },
  { href: "#homeware", label: "Homeware" },
  { href: "#visit", label: "Visit" },
];

/* Over a full-bleed hero the nav has to disappear into the photograph, then
   become a solid bar once the page scrolls under it. One nav style that
   swaps on scroll — not per-section colour detection, which reads as a
   glitch rather than a decision. */
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
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5"
      >
        <a href="#top" className="flex items-baseline gap-2" aria-label="B Boutique, home">
          <span className="display text-2xl leading-none">B</span>
          <span className={`label pt-0.5 ${scrolled ? "text-onyx-veil" : "text-bone/70"}`}>
            Boutique
          </span>
        </a>

        <ul className="hidden items-center gap-8 sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm transition-colors ${
                  scrolled ? "text-onyx-lift hover:text-onyx" : "text-bone/85 hover:text-bone"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#visit"
          className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
            scrolled
              ? "bg-onyx text-bone hover:bg-gold"
              : "border border-bone/40 text-bone hover:border-bone hover:bg-bone hover:text-onyx"
          }`}
        >
          Find us
        </a>
      </nav>
    </header>
  );
}
