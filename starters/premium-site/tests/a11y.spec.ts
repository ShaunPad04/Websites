import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility floor.
 *
 * axe catches roughly half of what actually matters. A missing h1, a keyboard
 * trap, a focus ring invisible against its background, a dialog that never
 * restores focus, and alt text that is present but wrong all pass a green run.
 * The keyboard and structural checks below exist because of that gap — they
 * are not redundant with the axe scan.
 */

test.describe("accessibility", () => {
  test("has no serious or critical axe violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    if (blocking.length > 0) {
      console.error(
        blocking
          .map(
            (v) =>
              `[${v.impact}] ${v.id}: ${v.help}\n  ${v.nodes
                .slice(0, 3)
                .map((n) => n.target.join(" "))
                .join("\n  ")}`
          )
          .join("\n\n")
      );
    }

    expect(blocking).toEqual([]);
  });

  test("has exactly one h1 and a sensible heading order", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);

    const levels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((nodes) => nodes.map((n) => Number(n.tagName[1])));

    // No heading may jump more than one level deeper than its predecessor.
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test("skip link is reachable and focusable by keyboard", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("href", "#main");
    await expect(focused).toBeVisible();
  });

  test("keyboard navigation reaches interactive content without a trap", async ({
    page,
  }) => {
    await page.goto("/");

    // Read document.activeElement directly rather than via a `:focus`
    // locator — the locator is strict-mode sensitive and races with elements
    // that move focus on mount, which made this assertion flaky rather than
    // meaningful.
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const id = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return `${el.tagName}:${el.getAttribute("href") ?? el.id ?? el.textContent?.trim().slice(0, 24) ?? ""}`;
      });
      if (id) seen.add(id);
    }

    // A trap would collapse this to one or two repeating targets.
    expect(seen.size).toBeGreaterThan(5);
  });

  test("every image has an alt attribute", async ({ page }) => {
    await page.goto("/");
    const missing = await page
      .locator("img:not([alt])")
      .count();
    expect(missing).toBe(0);
  });
});

test.describe("responsive integrity", () => {
  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    // 1px of tolerance for sub-pixel rounding.
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("primary calls to action meet the 44px touch target minimum", async ({
    page,
  }) => {
    await page.goto("/");

    // Generic: first real link on the page, not a client-specific CTA string.
    const cta = page.getByRole("link").filter({ hasNot: page.locator("[aria-hidden=\"true\"]") }).first();
    const box = await cta.boundingBox();

    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("content integrity", () => {
  test("no placeholder markers are rendered", async ({ page }) => {
    await page.goto("/");
    const body = (await page.locator("body").innerText()).toLowerCase();

    for (const marker of [
      "placeholder",
      "lorem ipsum",
      "client name",
      "project name",
      "example.com",
      "todo",
      "tbc",
    ]) {
      expect(body).not.toContain(marker);
    }
  });
});
