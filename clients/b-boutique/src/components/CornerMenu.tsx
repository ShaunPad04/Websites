"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { MENU, directionsHref, socials } from "@/lib/nav";
import { addressLines } from "@/lib/shop";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Corner menu.
 *
 * Anchored to the top-right and expands inward from that corner — transform
 * origin sits at top right so the panel grows out of the trigger rather than
 * appearing in the middle of the photograph.
 *
 * Every destination is a real <a href> to a section that exists, so the links
 * are crawlable and work with JavaScript disabled. The animation is layered
 * on top of working markup, not a prerequisite for it. */
export function CornerMenu({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Focus returns to where it came from.
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      // Focus trap: cycle within the panel rather than escaping to the page
      // behind it.
      const focusables = panel.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    // Lock the page and take the rest of it out of the a11y tree.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    // Move focus into the panel.
    const t = window.setTimeout(
      () => panel.current?.querySelector<HTMLElement>("a[href]")?.focus(),
      reduced ? 0 : 260,
    );

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      window.clearTimeout(t);
    };
  }, [open, close, reduced]);

  const panelMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 },
        transition: { duration: 0.01 } }
    : {
        initial: { opacity: 0, scale: 0.92, y: -10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -6, transition: { duration: 0.28, ease: EASE } },
        transition: { duration: 0.55, ease: EASE },
      };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        /* relative z-[60] keeps the trigger above the panel. The panel is a
           sibling inside <header>, so its z-50 competes here, not against the
           header's own z-index — raising the header alone changed nothing. */
        className={`group relative z-[60] inline-flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.14em] transition-colors ${
          open || scrolled
            ? "bg-onyx text-bone hover:bg-onyx-lift"
            : "bg-bone text-onyx hover:bg-white"
        }`}
      >
        <span className="uppercase">{open ? "Close" : "Menu"}</span>
        {/* The 45-degree hover turn belongs to the arrow only — applied to
            the close glyph it rotates the cross into a plus. */}
        <svg
          width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true"
          className={
            open
              ? ""
              : "transition-transform duration-300 ease-out group-hover:rotate-45"
          }
        >
          {open ? (
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M3 11L11 3M11 3H4.5M11 3v6.5" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key="veil"
              className="fixed inset-0 z-40 bg-onyx/55 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.35 }}
              onClick={close}
              aria-hidden="true"
            />

            {/* Fixed rail matching the header's own max-width and padding, so
                the panel opens from the trigger's corner rather than the
                viewport's — they are 500px apart at 2560. */}
            <div className="pointer-events-none fixed inset-x-0 top-3 z-50 mx-auto max-w-[100rem] sm:top-5">
            <motion.div
              key="panel"
              id={panelId}
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="pointer-events-auto absolute right-4 top-0 w-[min(24rem,calc(100vw-2rem))] sm:right-6 origin-top-right overflow-hidden rounded-[22px] bg-ink-deep text-bone shadow-[0_30px_80px_rgba(0,0,0,.6)]"
              style={{ maxHeight: "calc(100svh - 1.5rem)" }}
              {...panelMotion}
            >
              <div className="grain relative flex max-h-[calc(100svh-1.5rem)] flex-col overflow-y-auto p-6 pt-20 sm:pt-[5.5rem]">
                <p className="mb-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-bone/50">
                  Navigation
                </p>

                <ul className="flex flex-col">
                  {MENU.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { duration: 0.42, ease: EASE, delay: 0.12 + i * 0.055 }
                      }
                      className="border-b border-bone/12 last:border-b-0"
                    >
                      <a
                        href={item.href}
                        onClick={close}
                        className="group flex min-h-[44px] items-center gap-3.5 py-2.5 transition-[padding] duration-200 ease-out hover:pl-1.5 focus-visible:pl-1.5"
                      >
                        <span className="w-6 shrink-0 font-mono text-[0.625rem] leading-none text-bone/50 transition-colors duration-200 group-hover:text-gold-lift group-focus-visible:text-gold-lift">
                          {item.n}
                        </span>
                        {/* Heavy grotesque in caps — the reference's defining
                            character. 29px / 800 / 0.98 / -0.02em. */}
                        <span className="font-grotesk text-[1.6rem] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] sm:text-[1.8rem]">
                          {item.label}
                        </span>
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"
                          className="ml-auto shrink-0 self-center opacity-50 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-90 group-focus-visible:translate-x-0.5 group-focus-visible:opacity-90">
                          <path d="M3 11L11 3M11 3H4.5M11 3v6.5" stroke="currentColor" strokeWidth="1.6"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.42, ease: EASE, delay: 0.12 + MENU.length * 0.055 }
                  }
                  className="mt-6"
                >
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-between gap-3 border border-bone/40 px-4 py-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-onyx"
                  >
                    <span>Find us</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
                      className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>

                  {/* Contact set in monospace, matching the reference's
                      utility register. Real address and hours only — no
                      social accounts are held anywhere in this project. */}
                  <p className="mb-2.5 mt-8 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-bone/50">
                    Contact
                  </p>
                  <address className="not-italic font-mono text-[0.6875rem] leading-[1.75] text-bone/75">
                    {addressLines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                  <p className="mt-2.5 font-mono text-[0.6875rem] leading-[1.75] text-bone/60">
                    Tue &ndash; Sun / 10:00 &ndash; 16:00
                  </p>

                  {/* Rendered only once real handles exist — see lib/nav.ts */}
                  {socials.length ? (
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {socials.map((sn) => (
                        <li key={sn.name}>
                          <a
                            href={sn.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bone/70 underline decoration-bone/25 underline-offset-4 transition-colors hover:text-bone"
                          >
                            {sn.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </motion.div>
              </div>
            </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
