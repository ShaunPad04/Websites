import { ImageSlot } from "./ImageSlot";

/* Full-bleed cinematic hero.
 *
 * One image holds the whole viewport, the headline sits in the quiet left
 * third, and nothing else competes. The live open/closed badge deliberately
 * does NOT appear here — a trading notice undercuts the register. It lives
 * in the Visit section, where someone is actually deciding whether to come. */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden lg:min-h-[92svh]"
    >
      {/* The photograph, drifting slightly slower than the page */}
      <div data-parallax-hero className="absolute inset-0 -z-10 scale-[1.06]">
        <ImageSlot
          tone="marble"
          seed={3}
          slot="hero"
          priority
          alt="Inside B Boutique — womenswear on a brass rail against the black marble wall"
          className="h-full w-full"
        />
      </div>

      {/* Scrims. Two, not one: a vertical lift so the type has a floor, and a
          horizontal one so the left third stays quiet whatever the photograph
          does there. Without both, overlaid type is a coin toss. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(12,10,9,.92) 0%, rgba(12,10,9,.45) 38%, rgba(12,10,9,.10) 68%, rgba(12,10,9,.35) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(12,10,9,.80) 0%, rgba(12,10,9,.35) 34%, transparent 62%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-20 lg:pb-24">
        <p className="label text-gold-lift">Seaview Street · Cleethorpes</p>

        <h1
          data-split
          className="display mt-6 max-w-[15ch] text-[clamp(2.75rem,6.4vw,5.25rem)] text-bone"
        >
          Clothes you won&rsquo;t meet coming the other way{" "}
          <span className="italic text-gold-lift">down the high street.</span>
        </h1>

        <p className="mt-7 max-w-lg text-[1.0625rem] leading-relaxed text-bone/75">
          An independent boutique on one street, run by people who pick every
          piece themselves. Womenswear, accessories and homeware — small runs,
          no repeats.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#rails"
            className="rounded-full bg-bone px-7 py-3.5 text-onyx transition-colors hover:bg-gold-lift"
          >
            See what&rsquo;s in
          </a>
          <a
            href="#visit"
            className="rounded-full border border-bone/35 px-7 py-3.5 text-bone transition-colors hover:border-bone"
          >
            Visit the shop
          </a>
        </div>
      </div>

      {/* Scroll cue — the one small piece of ambient motion in the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 right-6 hidden items-center gap-3 lg:flex"
      >
        <span className="label text-bone/45">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-bone/20">
          <span className="absolute inset-x-0 top-0 h-4 animate-[drop_2.4s_ease-in-out_infinite] bg-gold-lift" />
        </span>
      </div>
    </section>
  );
}
