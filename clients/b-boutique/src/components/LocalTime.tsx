"use client";

import { useEffect, useState } from "react";

/* The small utility detail in the nav — a live local clock, the way the
   reference sites carry one. For a shop it does quiet double duty: it says
   "this is a real place, in a real town, right now" without resorting to a
   trading notice. Renders only after mount; the server cannot know the time
   in Cleethorpes and a guessed one would hydrate wrong. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/London",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="label tabular-nums" suppressHydrationWarning>
      Cleethorpes {time ?? "--:--"}
    </span>
  );
}
