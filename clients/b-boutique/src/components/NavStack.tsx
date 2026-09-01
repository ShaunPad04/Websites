"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export type NavSection = { id: string; label: string; n: string };

export const SECTIONS: NavSection[] = [
  { id: "rails", label: "The Rails", n: "01" },
  { id: "homeware", label: "Homeware", n: "02" },
  { id: "visit", label: "Visit", n: "03" },
];

/* Editorial easing: a single ease-out with no overshoot. A spring here would
   bounce, and the brief is restrained. */
const EASE = [0.22, 1, 0.36, 1] as const;
const T = { duration: 0.42, ease: EASE };

/* One stacked object, not three links.
 *
 * The active section is moved to the head of the list and the rest keep
 * their order behind it. Because each row carries motion's `layout`, that
 * reordering is animated as physical movement — rows slide between stack
 * positions rather than cross-fading in place. That is the whole effect.
 *
 * A single component serves both breakpoints. Rendering separate desktop and
 * mobile stacks put two `aria-current` elements in the DOM at once, since a
 * CSS-hidden nav is still in the accessibility tree. Here the layout flips
 * from a row to a column in CSS and there is exactly one current item. */
export function NavStack({ scrolled }: { scrolled: boolean }) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const activeRef = useRef(0);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!els.length) return;

    /* A zero-height band across the viewport at 38% depth. A section is
       "current" only while it crosses that line, so at most one qualifies at
       a time.
     *
     * The first attempt ranked sections by intersectionRatio, which always
     * favours the tallest — and `#rails` is pinned, so it stayed dominant
     * across most of the page and Homeware was skipped entirely. Height is
     * irrelevant to this band; crossing order is what matters. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = SECTIONS.findIndex((s) => s.id === e.target.id);
          if (i !== -1 && i !== activeRef.current) {
            activeRef.current = i;
            setActive(i);
          }
        }
      },
      { rootMargin: "-38% 0px -62% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });

  // Active to the head; everything else holds its order behind it.
  const ordered = [
    SECTIONS[active],
    ...SECTIONS.filter((_, i) => i !== active),
  ];

  /* Inactive rows keep the same ink as the active one and recede by opacity
     alone. Dimming the colour as well pushed them under 4.5:1 — at 0.36 over
     the brightest red in the hero plate they measured 1.92:1, and even 0.70
     only reached 3.99:1. axe cannot catch that, because it cannot sample
     contrast against a photograph.
   *
     0.62 clears 4.5:1 on both grounds, and the hierarchy is carried by scale,
     the gold number and the hairline instead. */
  const ink = scrolled ? "text-onyx" : "text-bone";
  const gold = scrolled ? "text-gold" : "text-gold-lift";

  return (
    <nav aria-label="Sections of this page">
      <motion.ul
        layout={!reduced}
        transition={T}
        className="flex flex-row items-center gap-0.5 lg:flex-col lg:items-start lg:gap-[3px]"
      >
        {ordered.map((s) => {
          const isActive = s.id === SECTIONS[active].id;
          return (
            <motion.li
              key={s.id}
              layout={!reduced}
              transition={T}
              animate={{
                opacity: isActive ? 1 : 0.62,
                scale: isActive ? 1 : 0.84,
              }}
              initial={false}
              style={{ transformOrigin: "left center" }}
              className="lg:origin-left"
            >
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex h-11 items-center gap-2 px-1.5 text-left transition-colors lg:h-auto lg:px-0 lg:py-[1px] ${ink}`}
              >
                <span className={`label tabular-nums ${isActive ? gold : ""}`}>
                  {s.n}
                </span>

                {/* On mobile the inactive rows collapse to their number, so
                    the stack stays off the model's face; on desktop every
                    label stays visible behind the dominant one. */}
                <span
                  className={`whitespace-nowrap text-xs tracking-tight lg:inline lg:text-sm ${
                    isActive ? "inline" : "hidden"
                  }`}
                >
                  {s.label}
                </span>

                {/* Hairline that only draws under the dominant row */}
                <motion.span
                  aria-hidden="true"
                  className="hidden h-px bg-current lg:block"
                  initial={false}
                  animate={{ width: isActive ? 24 : 0, opacity: isActive ? 0.45 : 0 }}
                  transition={reduced ? { duration: 0 } : T}
                />
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </nav>
  );
}
