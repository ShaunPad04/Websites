import { brands } from "@/lib/brands";

/* The brand marquee — one thin band directly under the hero.
 *
 * Each mark is the official artwork used as a CSS mask, sized to its own
 * measured INK bounds and painted in --bb-grey-light. The file is never
 * edited: a brand's trademark stays exactly as supplied, and the monochrome
 * treatment is presentation. Because the box is the ink rather than the file,
 * the marks sit on one optical axis and the spacing between them is
 * artwork-to-artwork instead of padding-to-padding.
 *
 * Seamless loop: the same list is rendered twice and the track translates by
 * exactly -50%. At that point copy two sits precisely where copy one started,
 * so the reset is invisible — there is no jump to hide and no pause between
 * repetitions. The second copy is aria-hidden, so the row is announced once.
 *
 * This replaces the centre-weighted 3D carousel that used to live here. The
 * approved band is 68px tall; a carousel with perspective and per-mark scale
 * cannot say anything in 68px, and the two ideas were fighting. */
export function BrandRail() {
  const marks = brands.map((b) => (
    <span key={b.name} className="brand-item">
      <span
        className="brand-rail-mark"
        style={
          {
            "--mark": `url("${b.src}")`,
            "--cap": `${b.cap}px`,
            "--iw": b.iw,
            "--mw": b.mw,
            "--mh": b.mh,
            "--ox": b.ox,
            "--oy": b.oy,
          } as React.CSSProperties
        }
      />
      <span className="brand-sep" aria-hidden="true">
        &mdash;
      </span>
    </span>
  ));

  return (
    <section id="brands" aria-labelledby="brands-heading" className="brand-rail">
      <h2 id="brands-heading" className="sr-only">
        Brands in store
      </h2>
      <div className="brand-viewport">
        <div className="brand-track">
          <div className="brand-set">{marks}</div>
          <div className="brand-set" aria-hidden="true">
            {marks}
          </div>
        </div>
      </div>
    </section>
  );
}
