"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/* Reads the media query directly.
 *
 * Motion's own useReducedMotion() was returning false in this project even
 * with matchMedia(QUERY).matches === true, so the reduced branch never ran
 * and the scroll-driven text stayed at its inactive opacity for people who
 * had asked for less motion. Measured, not assumed — see the commit.
 *
 * Starts false so server and first client render agree, then corrects on
 * mount; the components using it render their readable state either way. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
