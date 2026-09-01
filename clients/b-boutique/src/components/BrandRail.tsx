import { brands } from "@/lib/brands";
import { LogoCarousel3D } from "./LogoCarousel3D";

/* The brand rail — one centre-weighted carousel directly under the hero.
 *
 * The section owns the composition; LogoCarousel3D owns the motion. Each mark
 * is a span sized to its own measured INK bounds, with the official artwork
 * used as a CSS mask so the file is never edited and the colour comes from
 * --bone. Because the box is the ink and not the file, every mark is centred
 * on the same optical axis and the spacing between them is artwork-to-artwork
 * rather than padding-to-padding. */
export function BrandRail() {
  const count = String(brands.length).padStart(2, "0");

  const items = brands.map((b) => ({
    name: b.name,
    node: (
      <span
        className="brand-rail-mark"
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
    ),
  }));

  return (
    <section aria-labelledby="brands-heading" className="brand-rail-section">
      <div className="mx-auto flex max-w-7xl items-baseline justify-between px-6">
        {/* Lifted a step from the 55/50 floor. AA needs 4.5:1 on --panel and
            bone at 45% measures 4.19:1, so these cannot go quieter without
            failing — 60/55 clears it with room. */}
        <h2 id="brands-heading" className="label text-bone/60">
          Brands in store
        </h2>
        <p className="label text-bone/55" aria-hidden="true">
          01 — {count}
        </p>
      </div>

      <LogoCarousel3D items={items} label="Brands in store" />
    </section>
  );
}
