"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#rails", label: "The rails" },
  { href: "#homeware", label: "Homeware" },
  { href: "#visit", label: "Visit" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-bone/85 backdrop-blur-md shadow-[0_1px_0_var(--line)]" : ""
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5"
      >
        {/* Wordmark. Swap for the supplied logo when it lands — the B is a
            separate element so the mark can drop straight in. */}
        <a href="#top" className="flex items-baseline gap-2" aria-label="B Boutique, home">
          <span className="display text-2xl leading-none">B</span>
          <span className="label pt-0.5 text-onyx-veil">Boutique</span>
        </a>

        <ul className="hidden items-center gap-8 sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-onyx-lift transition-colors hover:text-onyx"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#visit"
          className="rounded-full bg-onyx px-5 py-2.5 text-sm text-bone transition-colors hover:bg-gold"
        >
          Find us
        </a>
      </nav>
    </header>
  );
}
