import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { CategoryPanels } from "@/components/CategoryPanels";
import { NewInRail } from "@/components/NewInRail";
import { Homeware } from "@/components/Homeware";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PremiumMotion } from "@/components/PremiumMotion";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PremiumMotion />
      <Nav />
      <main id="main" className="flex-1">
        {/* 01 Hook — what this is, and that it is open today */}
        <Hero />
        {/* 02 The rails — the heroic interaction */}
        <CategoryPanels />
        {/* 03 Proof — actual stock, moving weekly */}
        <NewInRail />
        {/* 04 A second world — homeware */}
        <Homeware />
        {/* 05 The ask — a postcode, not a basket */}
        <Visit />
      </main>
      <Footer />
    </>
  );
}
