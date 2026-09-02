import type { Page } from '@playwright/test';

/**
 * Make a page deterministic enough to screenshot.
 *
 * Visual regression is only useful if a passing run means "nothing changed".
 * This site carries five separate sources of frame-to-frame variance, and every
 * one of them has to be pinned or the baselines rot within a day:
 *
 *   1. GSAP + ScrollTrigger  — scroll-driven timelines (PointOfView, Reveal)
 *   2. Lenis                 — smooth scroll, so scrollTo lands mid-tween
 *   3. Motion                — React enter/exit transitions
 *   4. NewInRail             — advances itself on a timer
 *   5. Footer                — prints `new Date().getFullYear()`
 *
 * Plus web fonts (13 faces) and lazy images, either of which can paint after
 * the screenshot if you don't wait for them.
 *
 * Order matters: the clock is pinned before first paint, motion is killed
 * before we scroll, and fonts are awaited last because scrolling can pull in
 * a face that had not been requested yet.
 */
export async function stabilise(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
      /* The caret blinks on any focused field and lands in snapshots. */
      * { caret-color: transparent !important; }
    `,
  });

  await page.evaluate(() => {
    const w = window as unknown as {
      gsap?: { globalTimeline: { pause: () => void }; ticker: { sleep: () => void } };
      ScrollTrigger?: { getAll: () => Array<{ kill: () => void }> };
      lenis?: { stop: () => void; destroy: () => void };
    };

    // GSAP: park every timeline on its final frame, then stop the ticker so
    // nothing re-renders behind us.
    w.ScrollTrigger?.getAll().forEach((t) => t.kill());
    w.gsap?.globalTimeline.pause();
    w.gsap?.ticker.sleep();

    // Lenis: hand scrolling back to the browser so scrollTo is instant.
    w.lenis?.stop();
    w.lenis?.destroy();

    // Anything still on a timer — the New In rail advances itself.
    let id = window.setTimeout(() => {}, 0);
    while (id--) {
      window.clearTimeout(id);
      window.clearInterval(id);
    }
  });

  // Walk the page so lazy images and scroll-triggered content commit, then
  // return to the top. Done in one pass rather than per-viewport-height steps:
  // the observers fire on intersection, not on how you got there.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
    }
    window.scrollTo(0, 0);
  });

  // Decoded, not merely fetched — a decoding image still repaints. Every wait
  // below is bounded: an image that 404s never settles, and an unbounded
  // Promise.all on it hangs the whole run rather than failing one assertion.
  await page.evaluate(async () => {
    const cap = <T>(p: Promise<T>, ms: number) =>
      Promise.race([p, new Promise((r) => setTimeout(r, ms))]);

    await cap(
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map((img) => img.decode().catch(() => undefined)),
      ),
      5000,
    );

    await cap(document.fonts.ready, 5000);
  });

  // Not `networkidle`: this page keeps connections open, so it can never go
  // idle and the wait burns the whole test timeout. A short settle after the
  // work above is both sufficient and bounded.
  await page.waitForTimeout(250);
}

/**
 * Pin the clock. Must run before the page loads, because the footer reads the
 * year during its first render — patching afterwards leaves the old value in
 * the DOM. A fixed date also keeps any future "open now" logic honest.
 */
export async function pinClock(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const FIXED = new Date('2026-01-15T12:00:00Z').valueOf();
    const RealDate = Date;
    class FrozenDate extends RealDate {
      constructor(...args: ConstructorParameters<typeof Date>) {
        super(...(args.length ? args : [FIXED]) as ConstructorParameters<typeof Date>);
      }
      static now() {
        return FIXED;
      }
    }
    window.Date = FrozenDate as unknown as DateConstructor;
  });
}
