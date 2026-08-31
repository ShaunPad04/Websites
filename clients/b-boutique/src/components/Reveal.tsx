"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Fires once on entry, then disconnects. No loops, no re-triggering on
   scroll-back — replaying an entrance is the fastest way to make a page
   feel cheap. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  as?: "div" | "section" | "li" | "header";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const d = delay ? ` d${delay}` : "";
  return (
    // @ts-expect-error -- polymorphic tag, ref type widens correctly at runtime
    <Tag ref={ref} className={`reveal${d} ${className}`}>
      {children}
    </Tag>
  );
}
