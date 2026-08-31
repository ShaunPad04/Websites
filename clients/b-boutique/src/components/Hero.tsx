import { ImageSlot } from "./ImageSlot";

/* Full-bleed cinematic hero, built on the structure the client referenced:
   the photograph holds the frame, the brand runs enormous across the bottom
   and crops off the edge, and two small asymmetric text blocks do the
   explaining. The scale of the wordmark is the whole idea — at this size it
   stops being a label and becomes the composition. */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
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

      {/* Two scrims: a floor for the wordmark, and a left-side wash so the
          small copy stays readable whatever the photograph does there. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(12,10,9,.94) 0%, rgba(12,10,9,.55) 30%, rgba(12,10,9,.08) 62%, rgba(12,10,9,.42) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(12,10,9,.62) 0%, rgba(12,10,9,.18) 30%, transparent 55%)",
        }}
      />

      {/* Mid-left stacked list — the reference's "Brand Design / Web Design" */}
      <ul className="absolute left-6 top-1/2 hidden -translate-y-1/2 space-y-1 text-[0.9375rem] font-medium leading-tight text-bone lg:block">
        <li>Womenswear</li>
        <li>Accessories</li>
        <li>Homeware</li>
      </ul>

      {/* Lower-right, right-aligned — the reference's bio block */}
      <p className="pointer-events-none absolute bottom-[38%] right-6 hidden max-w-[22rem] text-right text-[0.9375rem] font-medium leading-snug text-bone lg:block">
        Clothes you won&rsquo;t meet coming the other way down the high street.
        One shop, on one street, every piece chosen by hand.
      </p>

      {/* The wordmark. Cropped by the viewport edge on purpose. */}
      <div className="relative w-full overflow-hidden" data-mask>
        <h1
          className="chrome display select-none whitespace-nowrap px-4 text-center text-[clamp(3.5rem,15.5vw,15rem)] leading-[0.82] sm:px-6"
          style={{ marginBottom: "-0.12em" }}
        >
          B Boutique
        </h1>
      </div>

      {/* Mobile keeps the copy, stacked under the wordmark rather than
          floating — the absolute placements above need real width. */}
      <div className="px-6 pb-10 pt-6 lg:hidden">
        <p className="max-w-sm text-[0.9375rem] leading-snug text-bone/80">
          Clothes you won&rsquo;t meet coming the other way down the high
          street. Womenswear, accessories and homeware on Seaview Street.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#rails" className="rounded-full bg-bone px-6 py-3 text-sm text-onyx">
            See what&rsquo;s in
          </a>
          <a href="#visit" className="rounded-full border border-bone/40 px-6 py-3 text-sm text-bone">
            Visit
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-6 hidden items-center gap-3 lg:flex"
      >
        <span className="label text-bone/45">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-bone/20">
          <span className="absolute inset-x-0 top-0 h-4 animate-[drop_2.4s_ease-in-out_infinite] bg-gold-lift" />
        </span>
      </div>
    </section>
  );
}
