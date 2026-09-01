import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { BrandRail } from "@/components/BrandRail";
import { PointOfView } from "@/components/PointOfView";
import { HorizontalRails } from "@/components/HorizontalRails";
import { NewInRail } from "@/components/NewInRail";
import { Homeware } from "@/components/Homeware";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import { MotionLayer } from "@/components/MotionLayer";

export default function Home() {
  return (
    <>
      <MotionLayer />
      <Nav />
      <main id="main" className="flex-1">
        {/* 01 Hook — what this is */}
        <Hero />
        {/* 02 A breath — the labels on the rails, moving slowly */}
        <BrandRail />
        {/* 03 Editorial interlude — the statement, lit word by word */}
        <PointOfView />
        {/* 04 The rails — the heroic interaction */}
        <HorizontalRails />
        {/* 03 Proof — actual stock, moving weekly */}
        <NewInRail />
        {/* 05 A second world — homeware */}
        <Homeware />
        {/* 06 The ask — a postcode, not a basket */}
        <Visit />
      </main>
      <Footer />
    </>
  );
}
