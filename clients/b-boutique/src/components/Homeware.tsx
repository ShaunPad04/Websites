import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";

/* Homeware is a different world from the rails, so it gets a different
   surface: a light card lifted above the page, sea-glass accent instead of
   gold. The shift signals "you have walked to the back of the shop". */
export function Homeware() {
  return (
    <section
      id="homeware"
      aria-labelledby="homeware-heading"
      className="relative grain scroll-mt-24 bg-bone-deep py-20 sm:py-28"
      style={{ borderRadius: "52px 52px 0 0", marginTop: "-52px" }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <p className="label" style={{ color: "var(--gold)" }}>
            04 — The back of the shop
          </p>
          <h2
            id="homeware-heading"
            data-split
            className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]"
          >
            Things for the house,
            <br />
            chosen the same way.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-onyx-lift">
            Stoneware, candles, glass and linen. Most of it comes from small
            British makers, most of it arrives a few at a time, and all of it is
            here because someone liked it — not because a category needed
            filling.
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-onyx-lift">
            It is also the reason a lot of people come in three weeks before
            Christmas and leave with something wrapped.
          </p>
        </Reveal>

        {/* Two panels at different heights — an even pair would read as a
            template; the offset gives the composition somewhere to breathe. */}
        <Reveal delay={2} className="order-1 grid grid-cols-2 gap-4 lg:order-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <ImageSlot tone="gold" seed={21} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl">
            <ImageSlot tone="bone" seed={22} className="absolute inset-0 h-full w-full" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
