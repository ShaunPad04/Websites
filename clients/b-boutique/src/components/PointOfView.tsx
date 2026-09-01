"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/* Exact copy, held in one place so the line breaks are art direction rather
   than an accident of container width. */
const PRIMARY = [
  ["CLOTHES", "YOU", "WON’T"],
  ["MEET", "COMING", "THE"],
  ["OTHER", "WAY", "DOWN"],
  ["THE", "HIGH", "STREET."],
];

const SECONDARY = ["ONE SHOP.", "ONE STREET.", "EVERY PIECE", "CHOSEN BY HAND."];

const INACTIVE = "rgba(247, 244, 239, 0.19)";
const ACTIVE = "rgba(247, 244, 239, 1)";

/* The primary statement finishes illuminating at 74% of the section, leaving
   the last quarter to bring the secondary lines up — so the two never
   compete for attention. */
const PRIMARY_END = 0.74;

function Word({
  word,
  index,
  total,
  progress,
  reduced,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Each word gets its own slice of the run, with the ramps overlapping
  // slightly so the illumination reads as a wave rather than a metronome.
  const span = PRIMARY_END / total;
  const start = index * span;
  const end = start + span * 1.9;

  const color = useTransform(
    progress,
    [start, end, 1],
    [INACTIVE, ACTIVE, ACTIVE],
  );

  /* Driven by a MotionValue, so this never re-renders on scroll. Under
     reduced motion an explicit value is passed rather than dropping the
     style: motion writes styles imperatively, so removing the prop leaves
     whatever it last wrote on the node. */
  return (
    <motion.span style={{ color: reduced ? ACTIVE : color }}>{word}</motion.span>
  );
}

export function PointOfView() {
  const section = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  const flat = PRIMARY.flat();

  /* Secondary lifts only once the statement is essentially lit.
   *
   * Three-point ranges that explicitly hold their final value through
   * progress 1, rather than relying on clamping past the last stop. Measured:
   * a two-point [0.76, 0.94] range tracked exactly up to 0.90 and then
   * collapsed — opacity read 0.83 at progress 0.95 and 0 at progress 1. */
  const secondaryOpacity = useTransform(
    scrollYProgress,
    [0.76, 0.9, 1],
    [0, 1, 1],
  );
  const secondaryY = useTransform(scrollYProgress, [0.76, 0.9, 1], [10, 0, 0]);

  let counter = -1;

  return (
    <section
      ref={section}
      id="our-story"
      aria-labelledby="pov-heading"
      className="relative bg-ink-deep"
      style={{ height: "165vh" }}
    >
      {/* Meets the hero without a seam: the hero's red fades into this
          ground rather than butting against it. No rule, no hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(138,7,11,.38), rgba(14,9,8,0))",
        }}
      />

      {/* Padded past the fixed header so centring does not tuck the label
          under it: at 1440x900 the content block is 705px tall and centres at
          y=97, while the header is 104px. */}
      <div className="grain sticky top-0 flex h-[100svh] items-center overflow-hidden pt-20 lg:pt-28">
        <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-8 lg:px-16">
          <p className="label mb-8 text-bone/35 sm:mb-12 lg:mb-16">
            01 / Our point of view
          </p>

          {/* Offset from centre: a perfectly centred block reads generic, and
              the left edge gives the label something to hang from. */}
          <h2
            id="pov-heading"
            className="display text-bone max-w-[22ch] text-[clamp(2.6rem,12vw,5rem)] leading-[0.96] tracking-[-0.02em] sm:text-[clamp(3rem,8.5vw,6rem)] lg:max-w-none lg:text-[clamp(3.5rem,7.5vw,9rem)] lg:leading-[0.9]"
          >
            {PRIMARY.map((line, li) => (
              <span key={li} className="block">
                {line.map((w, wi) => {
                  counter += 1;
                  return (
                    <span key={wi}>
                      <Word
                        word={w}
                        index={counter}
                        total={flat.length}
                        progress={scrollYProgress}
                        reduced={reduced}
                      />
                      {wi < line.length - 1 ? " " : null}
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>

          <motion.p
            style={{
              opacity: reduced ? 1 : secondaryOpacity,
              y: reduced ? 0 : secondaryY,
            }}
            className="mt-10 max-w-xs text-[0.9375rem] leading-relaxed tracking-[0.02em] text-bone sm:mt-14 sm:text-base lg:mt-20 lg:max-w-sm"
          >
            {SECONDARY.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
