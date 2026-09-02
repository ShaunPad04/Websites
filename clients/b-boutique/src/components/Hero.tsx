import { HERO_CATEGORIES } from "@/lib/nav";
import { HeroPicture } from "./HeroPicture";

/* The campaign hero.
 *
 * One full-bleed photograph and four small pieces of type placed on it: the
 * categories at the left edge, the philosophy line at the right, SCROLL at the
 * bottom. That is the whole composition. The giant "B Boutique" wordmark that
 * used to run across the bottom of this section is deliberately gone — the
 * page has exactly one of those and it belongs at the very end, in the footer,
 * where it reads as a sign-off rather than a title card.
 *
 * ── Height ────────────────────────────────────────────────────────────────
 * 100svh, floored at 720 and capped at 1050. svh not vh, so a mobile browser's
 * collapsing toolbar cannot crop the face. The cap stops the photograph
 * becoming a mural on a tall desktop display and pushing the brand rail past
 * the fold on every screen.
 *
 * ── No pin ────────────────────────────────────────────────────────────────
 * This section used to sit inside a 140vh sticky track, which held it in place
 * for 40vh of scrolling before the page moved on. That is scroll-jacking by
 * another name, and it put a blank spacer between the hero and the brand rail.
 * The section is now exactly its own height and the two meet directly.
 *
 * ── Overlay ───────────────────────────────────────────────────────────────
 * No full-frame scrim. The red is the whole point of the picture and a black
 * wash turns it burgundy. What is here instead: two narrow edge gradients,
 * left and right only, sized to sit under the type and nothing else. The
 * centre of the frame — the eye, the hand, the ring, the earring — is
 * untouched. */
export function Hero() {
  return (
    <section
      id="top"
      className="hero relative isolate w-full overflow-hidden bg-bb-black"
    >
      <div className="hero-media absolute inset-0 -z-10">
        <HeroPicture />
      </div>

      {/* Edge gradients only. Left carries the categories, right the
          philosophy line; each stops well short of the portrait. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-[34%] max-w-[420px]"
        style={{
          background:
            "linear-gradient(to right, rgba(5,5,5,.52) 0%, rgba(5,5,5,.22) 45%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[30%] max-w-[380px] lg:block"
        style={{
          background:
            "linear-gradient(to left, rgba(5,5,5,.46) 0%, rgba(5,5,5,.18) 48%, transparent 100%)",
        }}
      />
      {/* A short foot, so SCROLL holds against the lightest part of the frame
          and the hero meets the brand rail's black without a visible seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[22%]"
        style={{
          background:
            "linear-gradient(to top, rgba(5,5,5,.66) 0%, rgba(5,5,5,.20) 55%, transparent 100%)",
        }}
      />

      {/* LEFT — a rule, then the three things the shop sells. Real anchors:
          womenswear and accessories both live on the rails. */}
      <nav
        aria-label="Shop categories"
        className="hero-fx hero-fx-left absolute left-[18px] sm:left-8 lg:left-9"
      >
        <div className="flex items-center gap-[22px]">
          {/* 72px, not 64: the rule reads as spanning the stack, so when the
              stack grew to 72 for the hit areas the rule had to grow with it
              or stop reaching the last label. */}
          <span
            aria-hidden="true"
            className="block h-[72px] w-px shrink-0"
            style={{ background: "rgba(255,255,255,.65)" }}
          />
          {/* 2.4, not 1.9. At 10px that is a 24px line box, and since each
              anchor is a block filling its line box, each target is exactly
              24px high — WCAG 2.2 §2.5.8 — with the three touching edge to
              edge and overlapping by nothing. The type itself is untouched:
              same size, weight, colour and tracking. The 5px of extra pitch
              is paid for by .hero-fx-left's bottom offset so the group keeps
              its midpoint; see globals.css. */}
          <ul className="space-y-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-bb-white"
              style={{ lineHeight: 2.4 }}>
            {HERO_CATEGORIES.map((c) => (
              <li key={c.label}>
                <a href={c.href} className="nav-link">{c.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* RIGHT — the philosophy line. On desktop it sits below the vertical
          middle at the right edge, clear of the face. On a phone there is no
          right half to sit in, so it drops to the lower left instead, under
          the hand and above SCROLL: same words, no overlap with the portrait
          either way. */}
      <p
        className="hero-fx hero-fx-right absolute bottom-[112px] left-[18px] w-[min(76%,320px)] text-[12px] font-normal sm:left-8 lg:bottom-auto lg:left-auto lg:right-9 lg:top-[58%] lg:w-[264px]"
        style={{ lineHeight: 1.7, color: "rgba(255,255,255,.94)" }}
      >
        Clothes you won&rsquo;t meet coming the other way down the high street.
        One shop, on one street, every piece chosen by hand.
      </p>

      {/* BOTTOM — SCROLL, and a hairline that runs to the edge of the frame. */}
      <div className="hero-fx hero-fx-scroll absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-bb-white">
          Scroll
        </span>
        <span
          aria-hidden="true"
          className="mt-3 block w-px"
          style={{ height: 44, background: "rgba(255,255,255,.60)" }}
        />
      </div>
    </section>
  );
}
