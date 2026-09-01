import { HeroPicture } from "./HeroPicture";

/* Full-bleed cinematic hero.
 *
 * One DOM tree, two layouts. Below `lg` the photograph takes a portrait band
 * at the top with the type beneath it on solid red; from `lg` the same
 * element becomes the full-bleed background and the brand runs enormous
 * across the bottom, cropped by the viewport edge.
 *
 * Mobile is a different layout rather than the desktop one squeezed:
 * force-cropping a 16:9 frame into a phone viewport shows about a fifth of
 * the image and destroys the composition.
 *
 * ── The scroll interaction ────────────────────────────────────────────────
 * The hero pins inside a slightly taller track and deconstructs as the track
 * passes: the photograph creeps closer, the secondary copy recedes, and the
 * base darkens towards the carousel's black so the boundary between the two
 * sections stops being a line. At progress 0 the composition is exactly the
 * approved still — every transform starts at its identity value.
 *
 * Driven entirely by Motion values off one `useScroll`, which reads the same
 * scroll position Lenis writes. No second rAF loop, no scroll listener, no
 * per-frame React state: Motion writes transform and opacity straight to the
 * nodes. Nothing here animates a layout property.
 *
 * The GSAP hero tweens that used to scrub [data-parallax-hero] and
 * [data-mask] have been removed — they wrote transforms to these same
 * elements and the two systems would have fought. GSAP keeps the entry
 * reveal, which runs on the h1 itself while Motion drives the wrapper, so
 * the two never touch the same node. */
export function Hero() {
  return (
    <div className="hero-track">
      <div className="hero-pin">
        <section
          id="top"
          /* pb on lg is the red buffer the wordmark sits above: the section is
             pinned at exactly 100svh, so the only way to get red between the
             mark and the brand rail is to lift the mark off the section's
             bottom edge. Below lg the mark already has the copy block and its
             pb-14 beneath it. */
          className="relative isolate flex flex-col justify-end bg-red lg:min-h-[100svh] lg:overflow-hidden lg:pb-[8vh]"
        >
          <div
            data-parallax-hero
            className="relative aspect-[941/1672] max-h-[66svh] w-full overflow-hidden lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto lg:max-h-none lg:scale-[1.04]"
          >
            <div className="hero-fx hero-fx-img h-full w-full">
              <HeroPicture />
            </div>
          </div>

          {/* Mobile: fade the band into the red the type sits on */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[46svh] h-[22svh] lg:hidden"
            style={{
              background:
                "linear-gradient(to top, var(--red) 0%, rgba(138,7,11,.6) 45%, transparent 100%)",
            }}
          />

          {/* Desktop scrims, tinted into the photograph's own red — a black scrim
              greys out the one colour the image is built on. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 hidden lg:block"
            style={{
              background:
                "linear-gradient(to top, rgba(52,3,6,.90) 0%, rgba(52,3,6,.46) 28%, rgba(52,3,6,.04) 56%, rgba(52,3,6,.30) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 hidden lg:block"
            style={{
              background:
                "linear-gradient(to right, rgba(52,3,6,.58) 0%, rgba(52,3,6,.16) 32%, transparent 56%)",
            }}
          />

          <div
            aria-hidden="true"
            className="hero-fx hero-fx-veil pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,.32) 52%, rgba(10,10,10,.86) 88%, var(--panel) 100%)",
            }}
          />

          <ul
            className="hero-fx hero-fx-aside absolute left-6 top-1/2 hidden -translate-y-1/2 space-y-1 text-[0.9375rem] font-medium leading-tight text-bone lg:block"
          >
            <li>Womenswear</li>
            <li>Accessories</li>
            <li>Homeware</li>
          </ul>

          <p
            className="hero-fx hero-fx-aside pointer-events-none absolute bottom-[38%] right-6 hidden max-w-[22rem] text-right text-[0.9375rem] font-medium leading-snug text-bone lg:block"
          >
            Clothes you won&rsquo;t meet coming the other way down the high street.
            One shop, on one street, every piece chosen by hand.
          </p>

          {/* Motion drives this wrapper; GSAP's entry reveal drives the h1
              inside it. Two systems, two nodes, no contention. */}
          <div className="hero-fx hero-fx-mark relative w-full">
            <div className="relative w-full overflow-hidden" data-mask>
              <h1
                className="hero-word chrome display select-none whitespace-nowrap px-6 text-center text-[clamp(2.75rem,15.5vw,15rem)] leading-[0.86] lg:leading-[0.82]"
              >
                B Boutique
                <span className="hero-reg" aria-hidden="true">
                  ®
                </span>
              </h1>
            </div>
          </div>

          {/* Mobile copy sits under the wordmark on solid red */}
          <div className="hero-fx hero-fx-aside px-6 pb-14 pt-6 lg:hidden">
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-bone">
              Clothes you won&rsquo;t meet coming the other way down the high
              street. Womenswear, accessories and homeware on Sea View Street.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#rails" className="rounded-full bg-bone px-6 py-3 text-sm text-onyx">
                See what&rsquo;s in
              </a>
              <a href="#visit" className="rounded-full border border-bone/45 px-6 py-3 text-sm text-bone">
                Visit
              </a>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hero-fx hero-fx-cue pointer-events-none absolute bottom-6 left-6 hidden items-center gap-3 lg:flex"
          >
            <span className="label text-bone/55">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-bone/25">
              <span className="absolute inset-x-0 top-0 h-4 animate-[drop_2.4s_ease-in-out_infinite] bg-gold-lift" />
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
