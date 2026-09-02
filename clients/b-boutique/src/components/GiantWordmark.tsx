"use client";

import { useEffect, useRef, useState } from "react";

/* The closing wordmark's reveal.
 *
 * The only client component in the footer. Everything else there is server
 * rendered and ships no JavaScript; this needs an observer because the brief
 * is "once", and a CSS view timeline is scrubbed — scroll back up and the
 * mark would sink into its own mask again, which is a fidget, not a reveal.
 *
 * Fires on entry, then disconnects. Under reduced motion the stylesheet holds
 * the mark at its final state, so the class this adds changes nothing. */
export function GiantWordmark({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* No reduced-motion branch here on purpose. The CSS already pins
       .fw-mark to its final transform and opacity under
       `prefers-reduced-motion: reduce`, so the class this observer adds is a
       no-op there — and setting state straight from an effect body to
       duplicate a rule CSS already enforces is the thing the lint rule is
       for. Reduced motion is handled once, in the stylesheet. */
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      /* A slice of it is enough. Waiting for the whole mark would mean it is
         already fully on screen before it starts moving. */
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="fw-mask">
      <div className={`fw-mark${shown ? " is-in" : ""}`}>{children}</div>
    </div>
  );
}
