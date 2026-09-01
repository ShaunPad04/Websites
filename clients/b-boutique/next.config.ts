import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: the hero is a 2.8 MB PNG and it is the LCP element, so the
    // encoding choice is the single biggest lever on that metric.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
