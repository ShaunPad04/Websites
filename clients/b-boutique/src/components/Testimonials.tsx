"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { testimonials, testimonialsPending } from "@/lib/testimonials";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ImageSlot } from "./ImageSlot";

const INTERVAL = 5500;

/* The customer voice — the black break between two cool-white sections.
 *
 * A split composition, not a review widget: the boutique's own photograph on
 * the left, one quote set large in Bodoni on the right, and nothing that looks
 * like a card, an avatar bubble or a star badge. It should read as a fashion
 * campaign interrupted by somebody talking.
 *
 * ── Slide state ───────────────────────────────────────────────────────────
 * Three states, not two, because "not showing" is two different things. The
 * slide that just left has to fall UPWARD (0 -> -12px) while the one arriving
 * rises from BELOW (+13px -> 0). A single is-active class cannot express that,
 * so the outgoing slide is marked is-leaving for the length of the transition
 * and everything else waits at +13px.
 *
 * ── Autoplay ──────────────────────────────────────────────────────────────
 * Paused by hover, by a hidden tab, and entirely by reduced motion. Because
 * `index` is a dependency of the timer effect, any manual navigation restarts
 * the interval for free — there is no separate reset to forget to call. */
export function Testimonials() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => {
        if (next === cur) return cur;
        setLeaving(cur);
        return (next + count) % count;
      });
    },
    [count],
  );

  const step = useCallback((dir: 1 | -1) => go(index + dir), [go, index]);

  // Clear the leaving mark once its transition has run, so a slide does not
  // stay stuck in the "fell upward" position and animate in from the wrong way.
  useEffect(() => {
    if (leaving === null) return;
    const t = window.setTimeout(() => setLeaving(null), 700);
    return () => window.clearTimeout(t);
  }, [leaving]);

  useEffect(() => {
    const onVis = () => setTabHidden(document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const paused = hovered || tabHidden || reduced || count < 2;

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, go]);

  /* Swipe. Horizontal intent has to be clear before this takes a gesture —
     otherwise an ordinary vertical scroll that drifts sideways would flick
     through the reviews. Nothing calls preventDefault, so the page keeps
     scrolling normally throughout. */
  const drag = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: React.PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    step(dx < 0 ? 1 : -1);
  };

  /* Arrow keys, but only while focus is inside this section — a document-level
     listener would steal them from the page. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  };

  const stateOf = (i: number) =>
    i === index ? "is-active" : i === leaving ? "is-leaving" : "";

  return (
    <section
      id="testimonials"
      aria-labelledby="tm-heading"
      aria-roledescription="carousel"
      className="tm"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => { setHovered(false); drag.current = null; }}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => { drag.current = null; }}
      onKeyDown={onKeyDown}
    >
      <h2 id="tm-heading" className="sr-only">
        What our customers say
      </h2>

      <div className="tm-media">
        {testimonials.map((t, i) => (
          <div key={t.slot} className={`tm-shot ${stateOf(i)}`} aria-hidden={i !== index}>
            <ImageSlot
              tone="marble"
              seed={31 + i}
              slot={t.slot}
              alt={i === index ? t.alt : ""}
              sizes="(min-width: 1024px) 47vw, 100vw"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ))}
      </div>

      <div className="tm-body">
        <div className="tm-inner">
          <p className="tm-eyebrow">What our customers say</p>

          {/* Height is reserved by the tallest slide, so swapping quotes never
              moves the controls or anything below the section. */}
          <div className="tm-stage">
            {testimonials.map((t, i) => (
              <blockquote key={i} className={`tm-slide ${stateOf(i)}`} aria-hidden={i !== index}>
                {/* No stars. A rating is a factual claim about what somebody
                    said, and none is known — see lib/testimonials.ts. They
                    appear on their own once real ratings exist. */}
                {t.rating ? (
                  <p className="tm-stars" aria-label={`${t.rating} out of 5`}>
                    {"★".repeat(t.rating)}
                  </p>
                ) : null}
                <p className="tm-quote">{t.quote}</p>
                <footer className="tm-meta">
                  <span className="tm-name">{t.name}</span>
                  <span className="tm-source">{t.source}</span>
                </footer>
              </blockquote>
            ))}
          </div>

          {testimonialsPending ? (
            <p className="tm-pending">
              [Placeholder testimonials — awaiting genuine customer reviews]
            </p>
          ) : null}

          <div className="tm-controls">
            {/* data-dir, not :first-of-type — the CSS leans each arrow the way
                it travels, and a selector that infers direction from document
                order silently reverses the day someone adds a third control. */}
            <button type="button" className="tm-arrow" data-dir="prev" onClick={() => step(-1)} aria-label="Previous testimonial">
              <span aria-hidden="true">&larr;</span>
            </button>
            <p className="tm-count" aria-live="off">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
            <button type="button" className="tm-arrow" data-dir="next" onClick={() => step(1)} aria-label="Next testimonial">
              <span aria-hidden="true">&rarr;</span>
            </button>
            <span className="tm-track" aria-hidden="true">
              <span className="tm-track-fill" style={{ width: `${((index + 1) / count) * 100}%` }} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
