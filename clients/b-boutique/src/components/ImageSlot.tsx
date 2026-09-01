/* An image slot whose *fallback* is designed, not a grey box.
 *
 * The dark slots render as veined black marble, echoing the feature wall in
 * the shop; the light ones as woven cloth. When `slot` resolves to a
 * photograph, SlotPhoto layers it on top — and drops back to this artwork if
 * the file fails to load, so a slot is never a broken-image icon. */

import { imageFor } from "@/lib/images";

import { SlotPhoto } from "./SlotPhoto";

export type Tone = "bone" | "onyx" | "marble" | "gold" | "red";

const RAMP: Record<Tone, [string, string]> = {
  bone:   ["#F2EBE1", "#CFC2B1"],
  onyx:   ["#221D1A", "#0E0B0A"],
  marble: ["#241F1D", "#0C0A09"],
  gold:   ["#D4B06A", "#8A6A2C"],
  red:    ["#A80A10", "#5C0407"],
};

export function ImageSlot({
  tone = "bone",
  label,
  seed = 0,
  className = "",
  slot,
  alt,
  priority = false,
  sizes,
}: {
  tone?: Tone;
  label?: string;
  seed?: number;
  className?: string;
  /** Key into src/lib/images.ts. When a photograph exists for this slot it
   *  is layered over the designed fallback below. */
  slot?: string;
  alt?: string;
  priority?: boolean;
  /** Passed to next/image for vendored files; ignored for remote ones. */
  sizes?: string;
}) {
  const [from, to] = RAMP[tone];
  const angle = 120 + ((seed * 37) % 90);
  const dark = tone === "onyx" || tone === "marble";
  const src = imageFor(slot);

  return (
    <div
      aria-hidden={src ? undefined : "true"}
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(${angle}deg, ${from}, ${to})` }}
    >
      {dark ? (
        /* Marble veining — soft turbulence displaced into thin bright seams */
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 400 500"
        >
          <defs>
            <filter id={`vein-${seed}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.05"
                numOctaves="4"
                seed={seed * 7 + 3}
              />
              <feDisplacementMap in="SourceGraphic" scale="58" />
            </filter>
          </defs>
          <g filter={`url(#vein-${seed})`} opacity="0.5">
            <path d="M-40 130 C 90 96, 190 190, 440 118" stroke="#EFE7DA" strokeWidth="2.2" fill="none" />
            <path d="M-40 260 C 120 300, 220 200, 440 280" stroke="#D8CDBB" strokeWidth="1.4" fill="none" opacity="0.75" />
            <path d="M-40 390 C 110 350, 250 430, 440 372" stroke="#EFE7DA" strokeWidth="1.7" fill="none" opacity="0.6" />
          </g>
        </svg>
      ) : (
        /* Light slots read as woven cloth rather than empty fill */
        <div
          className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,.7) 0 1px, transparent 1px 4px)," +
              "repeating-linear-gradient(-45deg, rgba(0,0,0,.5) 0 1px, transparent 1px 5px)",
          }}
        />
      )}

      {/* Light falling from the top-left, the way it does through a shopfront */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 18% 8%, rgba(255,255,255,.24), transparent 62%)",
        }}
      />
      <div className="grain absolute inset-0" />
      {src ? (
        <SlotPhoto
          src={src}
          alt={alt ?? ""}
          priority={priority}
          sizes={sizes ?? "100vw"}
        />
      ) : null}
      {label ? (
        <span className="label absolute bottom-3 left-3 text-white/55">{label}</span>
      ) : null}
    </div>
  );
}
