import { brands } from "@/lib/brands";

/* The brand rail — a slow, flat marquee directly under the hero.
 *
 * Deliberately not LogoCarousel3D: that one scales and blurs by distance from
 * centre, which is the wrong register here. This is architectural — one
 * constant speed, no depth, no chrome, the marks floating on the black.
 *
 * The movement is a CSS animation on the track, so no React state runs per
 * frame and nothing here can contend with Lenis or move the INP needle. The
 * track holds the list twice and translates by exactly -50%, which lands copy
 * two where copy one began: seamless, with no measuring and no reset jump.
 *
 * Duration, gap and optical height all shift at the sm breakpoint through CSS
 * custom properties rather than JS, so there is no layout read on mount.
 */
export function BrandRail() {
  const count = String(brands.length).padStart(2, "0");

  const marks = (hidden: boolean) => (
    <ul
      className="brand-rail-set"
      /* Copy two is decoration: the accessible list is copy one. */
      aria-hidden={hidden ? "true" : undefined}
    >
      {brands.map((b) => (
        <li key={b.name} className="brand-rail-item">
          {/* Recoloured with a mask rather than a fill, so the official
              artwork is never edited — the file is the stencil and the bone
              comes from the site. The slot is the mark's ink box; the mask is
              scaled and offset so the ink lands in it, whatever padding the
              supplied file happens to carry. */}
          <span
            className="brand-rail-mark"
            role="img"
            aria-label={hidden ? undefined : b.name}
            style={{
              "--mark": `url("${b.src}")`,
              "--cap": `${b.cap}px`,
              "--iw": b.iw,
              "--mw": b.mw,
              "--mh": b.mh,
              "--ox": b.ox,
              "--oy": b.oy,
            } as React.CSSProperties}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="brands-heading" className="brand-rail-section">
      <div className="mx-auto flex max-w-7xl items-baseline justify-between px-6">
        {/* 55% / 50% are the floor for AA on --panel: bone at 45% measures
            4.19:1 and fails. Quieter than this needs a lighter ground. */}
        <h2 id="brands-heading" className="label text-bone/55">
          Brands in store
        </h2>
        <p className="label text-bone/50" aria-hidden="true">
          01 — {count}
        </p>
      </div>

      <div className="brand-rail-viewport">
        <div className="brand-rail-track">
          {marks(false)}
          {marks(true)}
        </div>
      </div>
    </section>
  );
}
