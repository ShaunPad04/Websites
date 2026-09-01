"use client";

import { useEffect, useRef } from "react";
import { categories } from "@/lib/shop";
import { ImageSlot, type Tone } from "./ImageSlot";

const TONES: Tone[] = [
  "marble", "bone", "gold", "marble", "bone", "gold", "onyx", "bone",
];

/* Pinned horizontal scroll.
 *
 * The section sticks while vertical scroll drives the track sideways. Two
 * things keep it from feeling like the janky version of this pattern:
 *
 *   - The scroll distance is derived from the track's real overflow width, so
 *     the sequence finishes exactly as the pin releases. Hard-coding a
 *     multiple of viewport height is what makes these sections drift out of
 *     sync at unexpected widths.
 *   - `scrub` is a number, not `true`. That gives the translation a short
 *     catch-up time, which is where the inertia comes from — with `true` it
 *     is welded to the scrollbar and reads mechanical.
 *
 * Only `transform` is animated, so it stays on the compositor.
 *
 * Below `lg`, and whenever reduced motion is requested, no pinning happens at
 * all: the same markup falls back to a native scroll-snap rail, which already
 * swipes correctly on touch and needs no JavaScript. */
export function HorizontalRails() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sectionEl = section.current;
    const trackEl = track.current;
    if (!sectionEl || !trackEl) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    // GSAP is already a dependency; loading it here keeps it off the critical
    // path for visitors who never reach this section.
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.matchMedia();
      (ctx as ReturnType<typeof gsap.matchMedia>).add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Distance to travel = how far the track overflows its container.
          const distance = () => trackEl.scrollWidth - sectionEl.clientWidth;

          const tween = gsap.to(trackEl, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              // Pin for exactly as long as there is track left to move.
              end: () => "+=" + distance(),
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            gsap.set(trackEl, { x: 0 });
          };
        },
      );

      // Fonts and images change the track width; without this the pin length
      // is computed against a pre-font layout.
      document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={section}
      id="rails"
      aria-labelledby="rails-heading"
      className="relative scroll-mt-24 overflow-hidden bg-onyx py-20 text-bone sm:py-24"
      style={{ borderRadius: "0 0 52px 52px" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <p className="label text-gold-lift">02 — The rails</p>
        <h2
          id="rails-heading"
          data-split
          className="display mt-4 max-w-2xl text-[clamp(2.25rem,5vw,4rem)]"
        >
          Eight rails. Everything on them was chosen by hand.
        </h2>
        <p className="mt-5 max-w-md text-[0.975rem] leading-relaxed text-bone/70">
          No buying algorithm, no thousand-store rollout. If it is on the rail,
          someone stood in a showroom and decided it was worth the space.
        </p>
      </div>

      {/* The track. On desktop GSAP translates it; below that it is a plain
          scroll-snap rail, which is why touch works with no extra code. */}
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Shop by category"
        className="rail mt-12 flex gap-4 overflow-x-auto px-6 pb-4 lg:mt-16 lg:overflow-visible lg:will-change-transform"
      >
        {categories.map((cat, i) => (
          <li
            key={cat.slug}
            className="group w-[72vw] shrink-0 sm:w-[44vw] lg:w-[30rem]"
          >
            <a href="#visit" className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-[3/4]">
                <ImageSlot
                  tone={TONES[i]}
                  seed={i}
                  slot={`panel-${cat.slug}`}
                  alt={`${cat.name} at B Boutique`}
                  className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(12,10,9,.88) 0%, rgba(12,10,9,.22) 46%, transparent 72%)",
                  }}
                />
                <span className="absolute inset-x-0 bottom-0 p-6">
                  <span className="label text-gold-lift">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="display mt-1.5 block text-[1.75rem] leading-tight text-bone">
                    {cat.name}
                  </span>
                  <span className="mt-1.5 block max-w-xs text-sm text-bone/75">
                    {cat.note}
                  </span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
