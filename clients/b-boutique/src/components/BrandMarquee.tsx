import { marquee } from "@/lib/shop";
import { LogoCarousel3D } from "./LogoCarousel3D";

/* Sits directly under the hero. After a full-bleed photograph the page needs
   a breath before the rails start — a thin, quiet band that says what the
   shop is without another block of prose. */
export function BrandMarquee() {
  return (
    <section
      aria-label="What B Boutique sells"
      className="relative bg-onyx py-10 text-bone sm:py-14"
    >
      <LogoCarousel3D
        items={[...marquee]}
        label="What B Boutique sells"
        logoSize={56}
        gap={96}
        speed={34}
        minScale={0.66}
        maxScale={1.1}
        maxBlur={3}
      />
    </section>
  );
}
