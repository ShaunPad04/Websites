"use client";

import { useEffect, useId, useState } from "react";
import { LocalTime } from "./LocalTime";
import { ArrowButton } from "./ArrowButton";

const LINKS = [
  { href: "#rails", label: "The rails", n: "01" },
  { href: "#homeware", label: "Homeware", n: "02" },
  { href: "#visit", label: "Visit", n: "03" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Close on Escape, and stop the page scrolling behind the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

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
        className="mx-auto flex max-w-[100rem] items-center justify-between gap-6 px-6 py-4"
      >
        <div className="flex items-center gap-8">
          <a href="#top" className="flex items-baseline gap-1" aria-label="B Boutique, home">
            <span className="display text-xl leading-none">B Boutique</span>
            <span className="text-[0.6rem] align-super">®</span>
          </a>
          <span className={scrolled ? "hidden text-onyx-veil sm:block" : "hidden text-bone/70 sm:block"}>
            <LocalTime />
          </span>
        </div>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm transition-colors ${
                  scrolled ? "text-onyx-lift hover:text-onyx" : "text-bone/85 hover:text-bone"
                }`}
              >
                {l.label}
                <sup className="ml-0.5 text-[0.6rem] opacity-60">{l.n}</sup>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ArrowButton href="#visit" tone={scrolled ? "dark" : "light"}>
            Find us
          </ArrowButton>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-current/30 md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
              {open ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M2 6h14M2 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel. Rendered only when open so its links never sit in the
          tab order behind a closed menu. */}
      {open ? (
        <div
          id={panelId}
          className="fixed inset-0 top-[4.5rem] z-30 bg-onyx px-6 pt-8 md:hidden"
        >
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display block py-3 text-4xl text-bone"
                >
                  {l.label}
                  <sup className="ml-1 align-super text-sm text-gold-lift">{l.n}</sup>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm leading-relaxed text-bone/60">
            18 Seaview Street, Cleethorpes DN35 8HY
            <br />
            Tuesday to Sunday, 10 till 4
          </p>
        </div>
      ) : null}
    </header>
  );
}
