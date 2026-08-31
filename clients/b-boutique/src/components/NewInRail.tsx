"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { newIn } from "@/lib/shop";
import { ImageSlot, type Tone } from "./ImageSlot";

/* A carousel built on native CSS scroll-snap rather than a JS slider.
   It drags, it flicks, it works with a trackpad, it works with arrow keys,
   and it still works if JavaScript never loads. The buttons only add
   convenience on top of behaviour the browser already gives us. */
export function NewInRail() {
  const rail = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    // Advance by one card plus its gap, so a card never lands half-cropped.
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="newin-heading" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label text-gold">03 — Just arrived</p>
            <h2
              id="newin-heading"
              data-split
              className="display mt-4 text-[clamp(2rem,4.5vw,3.25rem)]"
            >
              New in this week
            </h2>
          </div>

          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Show previous pieces"
              className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-onyx hover:text-bone disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-onyx"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="Show more pieces"
              className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:bg-onyx hover:text-bone disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-onyx"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={rail}
        onScroll={sync}
        tabIndex={0}
        aria-label="New arrivals"
        className="rail mt-10 flex gap-4 overflow-x-auto px-6 pb-3 [scroll-padding-left:1.5rem]"
      >
        {newIn.map((piece, i) => (
          <li
            key={piece.name}
            className="group w-[68vw] shrink-0 sm:w-[38vw] lg:w-[23rem]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <ImageSlot
                tone={piece.tone as Tone}
                seed={i + 11}
                className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="display text-lg">{piece.name}</h3>
              <span className="label shrink-0 text-onyx-veil">{piece.category}</span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-8 max-w-7xl px-6 text-sm text-onyx-veil">
        Stock changes weekly and sells in the shop, not online.{" "}
        <a href="#visit" className="text-onyx underline decoration-gold decoration-2 underline-offset-4">
          Come and see what is on the rail today
        </a>
        .
      </p>
    </section>
  );
}
