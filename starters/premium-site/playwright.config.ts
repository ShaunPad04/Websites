import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.VERIFY_PORT ?? 3000);
const ORIGIN = `http://127.0.0.1:${PORT}`;

/** Discover the preinstalled Chromium; the revision is versioned, never hard-coded. */
function findChromium(): string | undefined {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "/opt/pw-browsers";
  if (!existsSync(root)) return undefined;
  for (const entry of readdirSync(root)) {
    if (!entry.startsWith("chromium-")) continue;
    const candidate = join(root, entry, "chrome-linux", "chrome");
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? findChromium();

/** scripts/verify.mjs owns one server and sets VERIFY_OWNS_SERVER=1; reuse, never tear down. */
const parentOwnsServer = process.env.VERIFY_OWNS_SERVER === "1";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],

  use: {
    baseURL: ORIGIN,
    trace: "retain-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },

  // Visual regression defaults. Per-assertion options still win.
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      caret: "hide",
      scale: "css",
    },
  },

  projects: [
    { name: "mobile-390",   use: { ...devices["Desktop Chrome"], viewport: { width: 390,  height: 844  } } },
    { name: "tablet-768",   use: { ...devices["Desktop Chrome"], viewport: { width: 768,  height: 1024 } } },
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900  } } },
  ],

  webServer: parentOwnsServer
    ? undefined
    : {
        command: "pnpm build && pnpm start",
        url: ORIGIN,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
