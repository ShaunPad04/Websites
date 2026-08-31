"use client";

import { useEffect, useState } from "react";
import { openState, type OpenState } from "@/lib/shop";

/* A live "we are open until 4" badge. Small, but it is the single most
   useful thing on the page for someone deciding whether to get in the car.
 *
 * Rendered only after mount: the server has no idea what time it is where
 * the visitor is standing, and shipping a server-rendered guess would mean
 * a hydration mismatch and, worse, a wrong answer. */
export function OpenBadge({ onDark = false }: { onDark?: boolean } = {}) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => setState(openState(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!state) {
    // Reserve the line so nothing shifts when the badge arrives.
    return <p className="h-6" aria-hidden="true" />;
  }

  const isOpen = state.state === "open";
  const copy =
    state.state === "open"
      ? `Open now — until ${state.closesAt}`
      : state.state === "opening-soon"
        ? `Opening at ${state.opensAt} today`
        : `Closed — open ${state.nextDay} at ${state.opensAt}`;

  const tone = onDark
    ? isOpen
      ? "text-bone"
      : "text-bone/70"
    : isOpen
      ? "text-onyx"
      : "text-onyx-veil";

  return (
    <p className="flex items-center gap-2.5 text-sm">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${isOpen ? "bg-gold" : onDark ? "bg-bone/40" : "bg-onyx-veil"}`}
        />
      </span>
      <span className={tone}>{copy}</span>
    </p>
  );
}
