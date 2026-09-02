"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { newIn } from "@/lib/shop";
import { ImageSlot, type Tone } from "./ImageSlot";

/* New in this week — the first light section after the black chapter.
 *
 * A carousel built on native CSS scroll-snap rather than a JS slider. It
 * drags, it flicks, it works with a trackpad, it works with arrow keys, and it
 * still works if JavaScript never loads. The buttons only add convenience on
 * top of behaviour the browser already has. Nothing autoplays: browsing stock
 * is the visitor's job, not the page's.
 *
 * ── What is under each photograph ─────────────────────────────────────────
 * Category, then name. Not brand and price — neither exists in the data, and
 * both are exactly the kind of thing that must not be invented for a shop
 * that has not opened. shop.ts is explicit that prices are absent on purpose:
 * the boutique sells in person and stock turns faster than a website does. So
 * the line under each piece is the real metadata we hold, and the section
 * closes by saying where to actually buy it.
 *
 * ── The photographs ───────────────────────────────────────────────────────
 * They are warm — brass rails, black marble, a bone floor, warm window light —
 * and the site around them is cool. They are not recoloured to fix that: the
 * files stay exactly as shot and a CSS filter calms them just enough to sit in
 * a cool room. Point at one and it returns to its own colour. */
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
    // One card plus its gap, so a card never lands half-cropped.
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section id="new-in" aria-labelledby="newin-heading" className="newin">
      <div className="newin-head">
        <div className="newin-title">
          <p className="newin-eyebrow">New arrivals</p>
          <h2 id="newin-heading" className="newin-h2">
            New in this week
          </h2>
        </div>

        {/* Editorial utility, not carousel furniture: a bare arrow with a
            44px hit area around it, no fill, no ring, no pill. */}
        <div className="newin-controls">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Show previous pieces"
            aria-controls="newin-rail"
            className="newin-arrow"
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="Show more pieces"
            aria-controls="newin-rail"
            className="newin-arrow"
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      <ul
        id="newin-rail"
        ref={rail}
        onScroll={sync}
        tabIndex={0}
        aria-label="New arrivals"
        className="newin-rail"
      >
        {newIn.map((piece, i) => (
          <li key={piece.slug} className="newin-item" style={{ "--i": i } as React.CSSProperties}>
            <div className="newin-media">
              <ImageSlot
                tone={piece.tone as Tone}
                seed={i + 11}
                slot={`new-${piece.slug}`}
                /* Empty on purpose. The category and name sit directly beneath
                   in real text, so a copy of the name here would just be
                   announced twice — and there is no per-piece description in
                   the data to say anything more useful without inventing it. */
                alt=""
                sizes="(min-width: 1280px) 19vw, (min-width: 768px) 31vw, 78vw"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="newin-cat">{piece.category}</p>
            <p className="newin-name">{piece.name}</p>
          </li>
        ))}
      </ul>

      <p className="newin-foot">
        Stock changes weekly and sells in the shop, not online.{" "}
        <a href="#visit" className="newin-viewall">
          View all new in <span className="newin-viewall-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </p>
    </section>
  );
}
