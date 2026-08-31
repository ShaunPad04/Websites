"use client";

import { useState } from "react";
import { categories } from "@/lib/shop";
import { ImageSlot, type Tone } from "./ImageSlot";

const TONES: Tone[] = ["marble", "bone", "gold", "marble", "onyx", "bone"];

/* The heroic moment of the page: a rail of panels where the focused one
   opens and the rest give way.
 *
 * Driven by React state rather than CSS :hover, because hover-only would
 * strand every touch and keyboard user. Pointer, tap and Tab all move the
 * same `active` index, so the interaction is identical for everyone. */
export function CategoryPanels() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="rails"
      aria-labelledby="rails-heading"
      className="relative scroll-mt-24 bg-onyx text-bone py-20 sm:py-28"
      style={{ borderRadius: "0 0 52px 52px" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="label text-gold-lift">02 — The rails</p>
        <h2
          id="rails-heading"
          className="display mt-4 max-w-2xl text-[clamp(2.25rem,5vw,4rem)]"
        >
          Six rails. Everything on them was chosen by hand.
        </h2>
        <p className="mt-5 max-w-md text-bone/70 text-[0.975rem] leading-relaxed">
          No buying algorithm, no thousand-store rollout. If it is on the rail,
          someone stood in a showroom and decided it was worth the space.
        </p>
      </div>

      {/* Desktop and up: the accordion. Below that it becomes a stack,
          because a 6-panel accordion at 375px is unusable. */}
      <ul className="mt-14 hidden gap-3 px-6 md:flex mx-auto max-w-7xl h-[30rem]">
        {categories.map((cat, i) => {
          const isActive = i === active;
          return (
            <li
              key={cat.slug}
              className="relative min-w-0 overflow-hidden rounded-2xl"
              style={{
                flexGrow: isActive ? 5 : 1,
                flexBasis: 0,
                transition: "flex-grow 720ms var(--ease-spring)",
              }}
            >
              <button
                type="button"
                aria-expanded={isActive}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group absolute inset-0 h-full w-full cursor-pointer text-left"
              >
                <ImageSlot
                  tone={TONES[i]}
                  seed={i}
                  className="absolute inset-0 h-full w-full"
                />
                {/* Gradient exit so type sits on the image instead of fighting it */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(12,10,9,.90) 0%, rgba(12,10,9,.28) 45%, transparent 72%)",
                  }}
                />

                {/* Collapsed: the name runs vertically up the panel.
                    Expanded: it turns and the note appears beneath. */}
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span
                    className="display block text-[1.6rem] text-bone"
                    style={{
                      writingMode: isActive ? "horizontal-tb" : "vertical-rl",
                      transform: isActive ? "none" : "rotate(180deg)",
                      transition: "all 520ms var(--ease-out)",
                    }}
                  >
                    {cat.name}
                  </span>
                  <span
                    className="block max-w-xs overflow-hidden text-sm text-bone/75"
                    style={{
                      maxHeight: isActive ? "5rem" : 0,
                      opacity: isActive ? 1 : 0,
                      marginTop: isActive ? "0.5rem" : 0,
                      transition:
                        "max-height 520ms var(--ease-out), opacity 380ms var(--ease-out) 140ms, margin-top 520ms var(--ease-out)",
                    }}
                  >
                    {cat.note}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Mobile: honest stacked cards. */}
      <ul className="mt-12 grid grid-cols-2 gap-3 px-6 md:hidden">
        {categories.map((cat, i) => (
          <li key={cat.slug} className="relative aspect-[3/4] overflow-hidden rounded-xl">
            <ImageSlot tone={TONES[i]} seed={i} className="absolute inset-0 h-full w-full" />
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(12,10,9,.86), transparent 65%)" }}
            />
            <span className="display absolute bottom-3 left-3 text-xl text-bone">
              {cat.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
