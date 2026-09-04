import { test, expect } from "@playwright/test";
import { gotoStable } from "./helpers/stabilise";

/**
 * VISUAL REGRESSION — generic infrastructure
 *
 * Uses Playwright's native `toHaveScreenshot()`. No third-party service.
 *
 * ROUTES is the only thing a project normally edits. Everything else here is
 * project-agnostic: there are no client selectors, no client copy and no
 * committed baselines. Baselines are generated per project on first run and
 * are stored next to this file under `visual.spec.ts-snapshots/`.
 *
 * Baselines are produced for each Playwright project (mobile-390, tablet-768,
 * desktop-1440), so one run covers all three breakpoints.
 *
 * FIRST RUN
 *   pnpm test:visual:update      # writes baselines — review them by eye
 *
 * THEREAFTER
 *   pnpm test:visual             # fails on any pixel drift
 *
 * NEVER update baselines to make a red test go green without looking at the
 * diff first. `--update-snapshots` is a deliberate act, which is why it is a
 * separate script and is not part of `pnpm verify`.
 */

const ROUTES: Array<{ path: string; name: string }> = [
  { path: "/", name: "home" },
  // Add routes as the site grows, e.g.
  // { path: "/about", name: "about" },
];

test.describe("visual regression", () => {
  for (const route of ROUTES) {
    test(`${route.path} full page matches baseline`, async ({ page }) => {
      await gotoStable(page, route.path);

      await expect(page).toHaveScreenshot(`${route.name}-full.png`, {
        fullPage: true,
        // Absorbs sub-pixel AA differences between machines without hiding
        // real layout or colour regressions.
        maxDiffPixelRatio: 0.01,
        animations: "disabled",
        caret: "hide",
        scale: "css",
      });
    });

    test(`${route.path} above the fold matches baseline`, async ({ page }) => {
      await gotoStable(page, route.path);

      // The viewport shot is the sensitive one: it is where hero motion,
      // font swap and LCP imagery would show up as drift.
      await expect(page).toHaveScreenshot(`${route.name}-fold.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.005,
        animations: "disabled",
        caret: "hide",
        scale: "css",
      });
    });
  }

  test("reduced-motion rendering is stable", async ({ page }) => {
    // Content must never be gated behind an animation. Under reduced motion the
    // page should still be fully rendered — this catches "invisible until
    // scrolled into view" reveals that never fire for reduced-motion users.
    await gotoStable(page, "/");

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    const opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
    expect(
      Number(opacity),
      "h1 is not fully opaque under reduced motion — content is gated behind an animation",
    ).toBeGreaterThan(0.99);
  });
});
