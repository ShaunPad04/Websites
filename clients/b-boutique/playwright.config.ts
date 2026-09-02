import { defineConfig, devices } from '@playwright/test';

// Claude Code web sessions ship Chromium at /opt/pw-browsers and set
// PLAYWRIGHT_BROWSERS_PATH. Never run `playwright install` there — point at the
// preinstalled binary instead. Locally, leave the env var unset and run
// `pnpm exec playwright install chromium` once.
const systemChromium = process.env.PLAYWRIGHT_BROWSERS_PATH
  ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium`
  : undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  // Visual-regression defaults. `animations: 'disabled'` is Playwright's own
  // freeze; tests/helpers/stabilise.ts handles what it cannot reach (GSAP's
  // ticker, Lenis, timers, fonts, lazy images).
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      maxDiffPixelRatio: 0.01,
    },
  },
  // A baseline is only comparable against the platform that produced it.
  snapshotPathTemplate: '{testDir}/{testFileName}-snapshots/{projectName}/{arg}{ext}',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    ...(systemChromium ? { launchOptions: { executablePath: systemChromium } } : {}),
  },
  // Responsive coverage: every suite runs at all three widths.
  projects: [
    { name: 'mobile',  use: { ...devices['Pixel 7'],   ...(systemChromium ? { launchOptions: { executablePath: systemChromium } } : {}) } },
    // Chromium-based tablet rather than devices['iPad (gen 7)'], which
    // defaults to WebKit — not installed in Claude Code web sessions.
    { name: 'tablet',  use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1112 }, isMobile: false, hasTouch: true, ...(systemChromium ? { launchOptions: { executablePath: systemChromium } } : {}) } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, ...(systemChromium ? { launchOptions: { executablePath: systemChromium } } : {}) } },
  ],
  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
