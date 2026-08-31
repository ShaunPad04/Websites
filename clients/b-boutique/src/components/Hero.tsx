import { ImageSlot } from "./ImageSlot";
import { OpenBadge } from "./OpenBadge";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section id="top" className="relative grain overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24">
        <Reveal className="max-w-2xl">
          <p className="label text-gold">Seaview Street · Cleethorpes</p>

          <h1
            data-split
            className="display mt-6 max-w-[13ch] text-[clamp(2.5rem,5.6vw,4.25rem)]"
          >
            Clothes you won&rsquo;t meet coming the other way{" "}
            <span className="italic text-gold">down the high street.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-onyx-lift">
            B Boutique is one shop, on one street, run by people who pick every
            piece themselves. Womenswear, accessories and homeware — small runs,
            no repeats, and nothing you will find in a retail park.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#rails"
              className="rounded-full bg-onyx px-7 py-3.5 text-bone transition-colors hover:bg-gold"
            >
              See what&rsquo;s in
            </a>
            <a
              href="#visit"
              className="rounded-full border border-line px-7 py-3.5 transition-colors hover:border-onyx"
            >
              Opening times
            </a>
          </div>

          <div className="mt-7">
            <OpenBadge />
          </div>
        </Reveal>

        {/* The image is cropped tall and bleeds off the right edge, so it
            reads as a shopfront window rather than a card sat on a page. */}
        <Reveal delay={2} className="relative">
          <div data-parallax-hero
            className="relative aspect-[4/5] max-h-[34rem] overflow-hidden rounded-[2rem] lg:aspect-[4/5]">
            <ImageSlot
              tone="marble"
              seed={3}
              slot="hero"
              priority
              alt="Inside B Boutique — a brass rail of womenswear against the black marble wall"
              className="absolute inset-0 h-full w-full"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(247,244,239,.32), transparent 45%)",
              }}
            />
          </div>

          {/* A small, quiet piece of proof, sat half-off the image so the two
              planes overlap instead of stacking. */}
          <div className="absolute -bottom-6 -left-4 flex items-center gap-4 rounded-2xl bg-bone px-5 py-4 shadow-[0_20px_44px_rgba(20,17,16,.22)] sm:-left-10">
            <p className="display text-[2.75rem] leading-none text-gold">6</p>
            <p className="max-w-[9rem] text-sm leading-snug text-onyx-lift">
              rails, refreshed
              <br />
              every week
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
