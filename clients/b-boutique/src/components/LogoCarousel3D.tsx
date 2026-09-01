"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselItem = {
  /** Accessible name, and the wordmark rendered when no `src` is given. */
  name: string;
  /** Optional logo file. Anything in public/ works. */
  src?: string;
};

export type LogoCarousel3DProps = {
  items: CarouselItem[];
  /** Height of a logo slot in px at desktop. Scales down on smaller screens. */
  logoSize?: number;
  gap?: number;
  /** Pixels per second of drift. */
  speed?: number;
  direction?: "left" | "right";
  minScale?: number;
  maxScale?: number;
  /** Blur in px applied at the far edges. Reduced automatically on smaller screens. */
  maxBlur?: number;
  dragSensitivity?: number;
  pauseOnHover?: boolean;
  className?: string;
  label?: string;
};

/* Centre-weighted 3D marquee.
 *
 * Every frame each item is positioned from a single scalar `offset`, and its
 * distance from the viewport centre drives scale, blur and opacity — that
 * centre weighting is the whole effect, not decoration on a flat marquee.
 *
 * Performance notes, since this runs every frame:
 *   - No React state in the loop. The rAF callback writes `transform`,
 *     `filter` and `opacity` straight to the DOM nodes it captured once.
 *   - Items are laid out absolutely from their measured widths, so nothing
 *     reflows as they move; only compositor properties change.
 *   - The list is repeated until it outruns the viewport and `offset` wraps
 *     modulo the whole track, so the loop has no seam to jump at.
 *   - IntersectionObserver stops the loop when the section is off screen, and
 *     visibilitychange stops it when the tab is hidden.
 *   - prefers-reduced-motion renders a static, unblurred row and never starts
 *     the loop at all.
 */
export function LogoCarousel3D({
  items,
  logoSize = 68,
  gap = 88,
  speed = 46,
  direction = "left",
  minScale = 0.62,
  maxScale = 1.12,
  maxBlur = 3.4,
  dragSensitivity = 1,
  pauseOnHover = true,
  className = "",
  label = "Brands we stock",
}: LogoCarousel3DProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const nodes = useRef<HTMLElement[]>([]);

  // Everything the loop mutates lives in refs: touching state here would
  // re-render 60 times a second.
  const offset = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  const paused = useRef(false);
  const visible = useRef(true);
  const raf = useRef<number | undefined>(undefined);
  const trackWidth = useRef(0);
  // Items are text wordmarks of very different widths ("HOMEWARE" vs
  // "CHOSEN BY HAND"). A single fixed step lays the long ones on top of their
  // neighbours, so every slot carries its own measured width and left edge.
  const widths = useRef<number[]>([]);
  const lefts = useRef<number[]>([]);
  const gapPx = useRef(gap);

  /* How many times the list is repeated. One copy is never enough: the row
     has to be wider than the viewport plus a slot, or a gap opens at the
     edge. Set once on mount and on resize — never per frame. */
  const [copies, setCopies] = useState(2);

  const measure = useCallback(() => {
    const vp = viewport.current;
    if (!vp) return;
    const w = vp.clientWidth;
    // Tighten spacing on narrow screens so the row stays even and the blur
    // cost stays low on mobile GPUs. Only the gap scales — the wordmarks size
    // themselves from CSS, so their measured width is already correct.
    const scaleFactor = w < 640 ? 0.66 : w < 1024 ? 0.82 : 1;
    gapPx.current = gap * scaleFactor;

    const els = nodes.current;
    if (els.length === 0) return;

    // offsetWidth is the untransformed layout width, so the running scale and
    // blur written by paint() do not feed back into the measurement.
    widths.current = els.map((n) => n.offsetWidth);

    let cursor = 0;
    lefts.current = els.map((n, i) => {
      const at = cursor;
      cursor += widths.current[i] + gapPx.current;
      return at;
    });
    trackWidth.current = cursor;

    // One set has to cover the viewport plus a slot at each edge, else a gap
    // opens at the frame edge. Measure the set actually rendered.
    const perSet = Math.min(items.length, els.length);
    let setWidth = 0;
    for (let i = 0; i < perSet; i++) setWidth += widths.current[i] + gapPx.current;
    if (setWidth > 0) {
      const needed = Math.max(2, Math.ceil((w + setWidth) / setWidth) + 1);
      setCopies((c) => (c === needed ? c : needed));
    }
  }, [gap, items.length]);

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;

    nodes.current = Array.from(vp.querySelectorAll<HTMLElement>("[data-logo]"));
    measure();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 640px)");

    const paint = () => {
      const w = vp.clientWidth;
      const centre = w / 2;
      const half = w / 2 || 1;
      const blurCap = narrow.matches ? Math.min(maxBlur, 1.4) : maxBlur;

      const total = trackWidth.current;
      if (!total) return;

      for (let i = 0; i < nodes.current.length; i++) {
        const node = nodes.current[i];
        const wI = widths.current[i] ?? 0;

        // Wrap over the whole measured track so the copies chain end to end —
        // no seam, no reset jump. An item past the right edge comes back round
        // to sit before the first, so the row is continuous in both directions.
        let x = (lefts.current[i] ?? 0) + offset.current;
        x = ((x % total) + total) % total;
        if (x > total - wI) x -= total;

        const itemCentre = x + wI / 2;
        const d = Math.min(Math.abs(itemCentre - centre) / half, 1);
        const eased = d * d; // bias the falloff so the centre stays sharp longer

        const scale = maxScale - (maxScale - minScale) * eased;
        const blur = reduced.matches ? 0 : blurCap * eased;
        const opacity = 1 - 0.55 * eased;

        node.style.transform = `translate3d(${x}px, -50%, 0) scale(${scale})`;
        node.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        node.style.opacity = String(opacity);
        node.style.zIndex = String(Math.round((1 - d) * 100));
      }
    };

    if (reduced.matches) {
      paint();
      return;
    }

    let last = performance.now();
    const dir = direction === "left" ? -1 : 1;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!paused.current && !dragging.current) {
        offset.current += dir * speed * dt;
      }
      if (!dragging.current && Math.abs(velocity.current) > 0.01) {
        // Inertia after a flick: exponential decay, framerate-independent.
        offset.current += velocity.current * dt;
        velocity.current *= Math.pow(0.0025, dt);
      }

      paint();
      raf.current = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf.current === undefined) {
        last = performance.now();
        raf.current = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (raf.current !== undefined) {
        cancelAnimationFrame(raf.current);
        raf.current = undefined;
      }
    };

    // Off screen or backgrounded: do no work at all.
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (e.isIntersecting && !document.hidden) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    io.observe(vp);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible.current) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      measure();
      paint();
    };
    window.addEventListener("resize", onResize);

    // The wordmarks are set in a webfont. Widths measured against the fallback
    // are wrong by enough to overlap, so re-measure once the real face lands.
    let stale = false;
    document.fonts?.ready.then(() => {
      if (!stale) {
        measure();
        paint();
      }
    });

    return () => {
      stale = true;
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [copies, direction, maxBlur, maxScale, measure, minScale, speed]);

  // Pointer drag with a velocity estimate for the throw.
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    velocity.current = 0;
    lastPointerX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = (e.clientX - lastPointerX.current) * dragSensitivity;
    lastPointerX.current = e.clientX;
    offset.current += dx;
    velocity.current = dx * 60;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  const repeated = Array.from({ length: copies }, () => items).flat();

  return (
    <div
      ref={viewport}
      className={`relative h-[9.5rem] w-full touch-pan-y select-none overflow-hidden sm:h-[11rem] ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={pauseOnHover ? () => (paused.current = true) : undefined}
      onMouseLeave={pauseOnHover ? () => (paused.current = false) : undefined}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      {/* A real, static list for assistive tech and for crawlers — the visual
          marquee is decoration over the top of it. */}
      <ul className="sr-only">
        {items.map((it) => (
          <li key={it.name}>{it.name}</li>
        ))}
      </ul>

      {repeated.map((it, i) => (
        <div
          key={`${it.name}-${i}`}
          data-logo
          aria-hidden="true"
          className="absolute left-0 top-1/2 flex items-center justify-center will-change-transform"
          style={{ height: logoSize }}
        >
          {it.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={it.src}
              alt=""
              draggable={false}
              className="h-full w-auto object-contain"
              style={{ color: "transparent" }}
            />
          ) : (
            <span className="display whitespace-nowrap text-[1.6rem] leading-none tracking-[0.14em] text-bone/90 sm:text-[2rem]">
              {it.name}
            </span>
          )}
        </div>
      ))}

      {/* Edge fades. The blur sells depth; these sell the idea that the row
          continues past the frame rather than being cut off. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40"
        style={{ background: "linear-gradient(to right, var(--onyx), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40"
        style={{ background: "linear-gradient(to left, var(--onyx), transparent)" }}
      />
    </div>
  );
}
