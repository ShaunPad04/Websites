"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type CarouselItem = {
  /** Accessible name. The visual row is decorative; this feeds the real list. */
  name: string;
  /** The rendered mark. Must carry its own explicit width and height — the
   *  loop measures it once and never reads layout again. */
  node: ReactNode;
};

export type LogoCarousel3DProps = {
  items: CarouselItem[];
  /** Base spacing between ink bounds, before optical adjustment. */
  gap?: number;
  /** Seconds for one full set to pass the frame. Speed is derived from this
   *  and the measured set width, so the cadence holds whatever the marks
   *  happen to measure. */
  cycleSeconds?: number;
  /** Spacing and mark sizes step down together below this width. */
  scaleAt?: { maxWidth: number; scale: number }[];
  minScale?: number;
  maxScale?: number;
  /** Opacity at the far edge. The centre is always 1. */
  minOpacity?: number;
  /** Degrees of rotateY at the far edge. Small on purpose. */
  tilt?: number;
  className?: string;
  label: string;
};

/* Centre-weighted 3D carousel.
 *
 * One continuous spatial track: every item is positioned from a single scalar
 * `offset`, and its distance from the frame's centre drives scale, opacity and
 * a small rotateY. The centre weighting is the effect — items do not animate
 * independently, they occupy one line and the line moves.
 *
 * Every item is centred on the same axis by its own box centre, and because
 * those boxes are ink bounds rather than file boxes, the *artwork* lines up
 * rather than the padding around it.
 *
 * Performance, since this runs every frame:
 *   - No React state in the loop. The rAF callback writes `transform` and
 *     `opacity` straight to nodes captured once on mount.
 *   - Only compositor properties change; nothing reflows mid-animation.
 *   - Widths are measured once (and again on resize and on fonts.ready),
 *     never per frame.
 *   - No filter/blur: it would cost a full-frame repaint on every item for a
 *     depth cue that scale and opacity already carry.
 *   - IntersectionObserver stops the loop off screen; visibilitychange stops
 *     it in a background tab. One rAF, owned here, so nothing contends with
 *     Lenis.
 *   - prefers-reduced-motion never starts the loop and never writes a
 *     transform, leaving the CSS to present a plain scrollable row.
 */
export function LogoCarousel3D({
  items,
  gap = 150,
  cycleSeconds = 56,
  scaleAt = [{ maxWidth: 640, scale: 0.8 }, { maxWidth: 1024, scale: 0.9 }],
  minScale = 0.84,
  maxScale = 1,
  minOpacity = 0.4,
  tilt = 7,
  className = "",
  label,
}: LogoCarousel3DProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const nodes = useRef<HTMLElement[]>([]);

  const offset = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  /* Hover eases this from 1 to 0 rather than toggling animation-play-state,
     so the row slows to a stop instead of snapping. */
  const rate = useRef(1);
  const rateTarget = useRef(1);
  const visible = useRef(true);
  const raf = useRef<number | undefined>(undefined);

  const widths = useRef<number[]>([]);
  const lefts = useRef<number[]>([]);
  const trackWidth = useRef(0);
  const speed = useRef(40);

  const [copies, setCopies] = useState(2);

  const measure = useCallback(() => {
    const vp = viewport.current;
    if (!vp) return;
    const w = vp.clientWidth;
    const step = scaleAt.find((s) => w < s.maxWidth);
    const base = gap * (step ? step.scale : 1);

    const els = nodes.current;
    if (els.length === 0) return;

    widths.current = els.map((n) => n.offsetWidth);
    const avg = widths.current.reduce((a, b) => a + b, 0) / widths.current.length;

    /* Optical spacing rather than one constant gap: the room between two
       marks is set by how wide they are, so a long wordmark is not crowded by
       the same measurement that suits a compact one. The pattern is periodic
       because the widths repeat, which is what keeps the loop seamless. */
    const gapAfter = (i: number) => {
      const next = widths.current[(i + 1) % widths.current.length] ?? avg;
      const mean = ((widths.current[i] ?? avg) + next) / 2;
      return Math.max(base * 0.8, base + (mean - avg) * 0.15);
    };

    let cursor = 0;
    lefts.current = els.map((_, i) => {
      const at = cursor;
      cursor += widths.current[i] + gapAfter(i);
      return at;
    });
    trackWidth.current = cursor;

    const perSet = Math.min(items.length, els.length);
    let setWidth = 0;
    for (let i = 0; i < perSet; i++) setWidth += widths.current[i] + gapAfter(i);
    if (setWidth > 0) {
      // Derive px/sec from the measured set so the cycle time is the spec,
      // not an approximation that drifts when a logo is swapped.
      speed.current = setWidth / cycleSeconds;
      /* Enough copies to cover the frame plus the widest mark, and no more.
         Every extra copy is another eight composited nodes the loop writes to
         each frame: the earlier `(w + setWidth) / setWidth` asked for a whole
         spare set and cost a third of the items for nothing. */
      const widest = Math.max(...widths.current.slice(0, perSet));
      const needed = Math.max(2, Math.ceil((w + widest) / setWidth) + 1);
      setCopies((c) => (c === needed ? c : needed));
    }
  }, [cycleSeconds, gap, items.length, scaleAt]);

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;

    nodes.current = Array.from(vp.querySelectorAll<HTMLElement>("[data-logo]"));
    measure();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Reduced motion gets no transform at all, so the CSS row is undisturbed.
    if (reduced.matches) return;

    const paint = () => {
      const w = vp.clientWidth;
      const centre = w / 2;
      const half = w / 2 || 1;
      const total = trackWidth.current;
      if (!total) return;

      for (let i = 0; i < nodes.current.length; i++) {
        const node = nodes.current[i];
        const wI = widths.current[i] ?? 0;

        let x = (lefts.current[i] ?? 0) + offset.current;
        x = ((x % total) + total) % total;
        if (x > total - wI) x -= total;

        const itemCentre = x + wI / 2;
        const signed = (itemCentre - centre) / half;
        const d = Math.min(Math.abs(signed), 1);
        const eased = d * d; // holds the centre sharp, then falls away

        const scale = maxScale - (maxScale - minScale) * eased;
        const opacity = 1 - (1 - minOpacity) * eased;
        // Away from the viewer on both sides, so the row reads as one plane
        // turning at its edges rather than a wall of tilted cards.
        const rot = -Math.sign(signed) * tilt * eased;

        node.style.transform =
          `translate3d(${x}px, -50%, 0) rotateY(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        node.style.opacity = opacity.toFixed(3);
        node.style.zIndex = String(Math.round((1 - d) * 100));
      }
    };

    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Framerate-independent ease toward the hover target.
      rate.current += (rateTarget.current - rate.current) * (1 - Math.pow(0.004, dt));

      if (!dragging.current) offset.current -= speed.current * rate.current * dt;
      if (!dragging.current && Math.abs(velocity.current) > 0.01) {
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

    // Marks are images; a late decode changes nothing, but a webfont in a
    // future mark would change widths, so re-measure when fonts settle.
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
  }, [copies, cycleSeconds, gap, maxScale, measure, minOpacity, minScale, tilt]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    velocity.current = 0;
    lastPointerX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointerX.current;
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
      className={`logo3d ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => (rateTarget.current = 0)}
      onMouseLeave={() => (rateTarget.current = 1)}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      {/* The real list, for assistive tech and crawlers. The moving row below
          is decoration over the top of it and is hidden from the tree, so the
          duplicated copies are never announced. */}
      <ul className="sr-only">
        {items.map((it) => (
          <li key={it.name}>{it.name}</li>
        ))}
      </ul>

      <div className="logo3d-stage" aria-hidden="true">
        {repeated.map((it, i) => (
          <div
            key={`${it.name}-${i}`}
            data-logo
            /* Copies past the first set exist only for the loop. Reduced
               motion hides them so the static row shows each brand once. */
            data-dup={i >= items.length ? "" : undefined}
            className="logo3d-item"
          >
            {it.node}
          </div>
        ))}
      </div>
    </div>
  );
}
