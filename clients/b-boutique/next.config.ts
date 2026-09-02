import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: the hero is a 2.8 MB PNG and it is the LCP element, so the
    // encoding choice is the single biggest lever on that metric.
    formats: ["image/avif", "image/webp"],
    /* 90 as well as the default 75. The category and New In photographs are
       re-encoded from source WebPs that are already lossy, so the optimiser's
       default 75 stacks a second generation of loss on top of the first and
       the result reads soft at desktop sizes. Next 16 requires every quality
       used to be declared here. */
    qualities: [75, 90],
  },
};

export default nextConfig;
