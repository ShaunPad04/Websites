import { test, expect } from '@playwright/test';
import { stabilise, pinClock } from './helpers/stabilise';

/**
 * Visual regression.
 *
 * Runs at all three viewports the config already defines, so a change is caught
 * wherever it lands. Baselines live in `tests/visual.spec.ts-snapshots/` and are
 * per-project, so `mobile` never compares itself against `desktop`.
 *
 * Updating a baseline is a deliberate act:
 *
 *     pnpm test:visual:update           # every viewport
 *     pnpm test:visual:update --project=mobile
 *
 * Review the diff in `test-results/` before you accept one. A baseline updated
 * without looking is a regression you have agreed to.
 *
 * ROUTES is the single list to extend as the site grows — matching the pattern
 * `accessibility.spec.ts` already uses.
 */
const ROUTES = ['/'] as const;

/**
 * Sections worth pinning on their own. A full-page shot tells you *something*
 * moved across 7,669px; a section shot tells you *what*. These are the four
 * that carry the heaviest motion, so they are the most likely to drift.
 */
const SECTIONS = [
  { name: 'hero', selector: 'main > *:first-child' },
  { name: 'our-story', selector: '#our-story' },
  { name: 'rails', selector: '#rails' },
  { name: 'new-in', selector: '#new-in' },
  { name: 'footer', selector: 'footer' },
] as const;

for (const route of ROUTES) {
  test.describe(`visual — ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await pinClock(page);
      await page.goto(route);
      await stabilise(page);
    });

    test('full page', async ({ page }) => {
      await expect(page).toHaveScreenshot('full-page.png', {
        fullPage: true,
        // The hero photograph is a JPEG; its edges resample by a pixel or two
        // between runs. Tight enough to catch a layout shift, loose enough not
        // to fail on compression noise.
        maxDiffPixelRatio: 0.01,
      });
    });

    for (const section of SECTIONS) {
      test(`section — ${section.name}`, async ({ page }) => {
        const el = page.locator(section.selector).first();
        // Sections are optional by design: a route that lacks one should skip,
        // not fail, so this spec keeps working as the site is restructured.
        if ((await el.count()) === 0) {
          test.skip(true, `no element matching ${section.selector}`);
          return;
        }
        await expect(el).toHaveScreenshot(`${section.name}.png`, {
          maxDiffPixelRatio: 0.01,
        });
      });
    }
  });
}
