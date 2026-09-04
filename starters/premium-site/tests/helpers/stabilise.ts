import type { Page } from "@playwright/test";

/**
 * DETERMINISM HELPERS FOR VISUAL REGRESSION
 *
 * A screenshot diff is only useful if the only thing that can change the pixels
 * is a real regression. On a premium marketing site that is not the default:
 * scroll-driven motion, smooth scrolling, autoplaying carousels, video, lazy
 * images, web fonts and a literal printed year all move under the camera.
 *
 * These helpers freeze every one of those sources. They are deliberately
 * generic: no project selectors, no client copy, no baseline assumptions.
 * Nothing here references a specific site, so this file is safe to copy into
 * every project unchanged.
 *
 * Usage:
 *   import { stabilise } from "./helpers/stabilise";
 *   await stabilise(page);
 *   await expect(page).toHaveScreenshot("home.png");
 */

/** A fixed instant so anything printing a date or year renders identically. */
export const FROZEN_TIME = new Date("2026-01-15T12:00:00.000Z");

/**
 * Kill animation before the page's own scripts run.
 *
 * Must be called before `page.goto()` — it installs an init script and a
 * stylesheet that libraries read as they boot. Handles:
 *
 *  - `prefers-reduced-motion` — the honest lever. Motion, GSAP wrappers and
 *    well-built CSS all respect it, and a site that ignores it has an
 *    accessibility bug the a11y suite should be catching anyway.
 *  - CSS animations/transitions — forced to zero duration, first frame held.
 *  - Lenis — smooth scroll is disabled so scroll positions land exactly.
 *  - GSAP — global timeline is fast-forwarded and ticker lagSmoothing disabled.
 *  - Date/Date.now — frozen, so "© {year}" and any relative time are stable.
 *  - Math.random — seeded, so decorative randomness stops jittering.
 */
export async function freezeMotion(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.addInitScript((iso: string) => {
    // ---- deterministic clock -------------------------------------------
    const fixed = new Date(iso).valueOf();
    const RealDate = Date;
    class FrozenDate extends RealDate {
      constructor(...args: unknown[]) {
        // @ts-expect-error - forwarding the real constructor signature
        super(...(args.length ? args : [fixed]));
      }
      static now() {
        return fixed;
      }
    }
    // @ts-expect-error - intentional global override for test determinism
    window.Date = FrozenDate;

    // ---- deterministic randomness --------------------------------------
    let seed = 0x2f6e2b1;
    Math.random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0x100000000;
    };

    // ---- tell motion libraries to stand down ----------------------------
    // Lenis reads this at construction; GSAP wrappers and app code commonly do.
    (window as unknown as Record<string, unknown>).__A11Y_REDUCED_MOTION__ = true;
    (window as unknown as Record<string, unknown>).__VISUAL_TEST__ = true;
  }, FROZEN_TIME.toISOString());

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
        caret-color: transparent !important;
      }
      html { scroll-behavior: auto !important; }
    `,
  });
}

/**
 * Settle everything that loads or moves after first paint.
 *
 * Call after `page.goto()` and before the screenshot assertion.
 */
export async function settlePage(page: Page): Promise<void> {
  // 1. Fonts — a late webfont swap reflows every line of text.
  await page.evaluate(() => document.fonts?.ready).catch(() => undefined);

  // 2. Lazy images — scroll the full height to trigger loading, then return.
  //    Native lazy-loading only fetches on approach, so an un-scrolled page
  //    screenshots with holes where below-the-fold images will be.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });

  // 3. Wait for every <img> to be decoded, not merely attached.
  await page
    .evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) =>
          img.complete ? img.decode().catch(() => undefined) : new Promise((r) => {
            img.addEventListener("load", () => r(null), { once: true });
            img.addEventListener("error", () => r(null), { once: true });
          }),
        ),
      );
    })
    .catch(() => undefined);

  // 4. Video — freeze at its poster/first frame rather than mid-playback.
  await page.evaluate(() => {
    document.querySelectorAll("video").forEach((v) => {
      v.pause();
      v.autoplay = false;
      v.currentTime = 0;
    });
  });

  // 5. GSAP — flush any in-flight tween to its end state.
  await page.evaluate(() => {
    const gsap = (window as unknown as { gsap?: { globalTimeline?: { progress: (v: number) => void }; ticker?: { lagSmoothing: (a: number, b: number) => void } } }).gsap;
    if (!gsap) return;
    gsap.ticker?.lagSmoothing(0, 0);
    gsap.globalTimeline?.progress(1);
  });

  // 6. Lenis — stop the RAF loop so scrollTop is exact, not easing toward it.
  await page.evaluate(() => {
    const lenis = (window as unknown as { lenis?: { stop?: () => void; destroy?: () => void } }).lenis;
    lenis?.stop?.();
  });

  // 7. Auto-advancing content (carousels, tickers, marquees). Generic and
  //    best-effort: pause CSS-driven marquees and any Embla-style autoplay
  //    exposed on the element. Projects with a bespoke carousel should add
  //    their own pause call in the project's own spec, not here.
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>("[data-marquee], .marquee, [data-autoplay]").forEach((el) => {
      el.style.animationPlayState = "paused";
      el.style.animation = "none";
    });
  });

  // 8. One more frame so the final layout is committed before capture.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(null))));
}

/**
 * The single call most specs want: freeze, navigate, settle.
 *
 * `freezeMotion` must run before navigation, so this wraps the ordering for you.
 */
export async function gotoStable(page: Page, path: string): Promise<void> {
  await freezeMotion(page);
  await page.goto(path, { waitUntil: "networkidle" });
  await settlePage(page);
}

/**
 * Convenience for specs that navigate themselves.
 * Equivalent to the tail of `gotoStable`.
 */
export async function stabilise(page: Page): Promise<void> {
  await settlePage(page);
}
