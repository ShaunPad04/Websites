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
  // Playwright starts this server AND kills it when the run ends. That is
  // correct for a standalone `pnpm test:a11y`, and wrong when a parent process
  // (`pnpm verify`) already owns a server that Lighthouse still needs
  // afterwards — killing it there is what produced 0/0/0/0 null-metric
  // Lighthouse runs.
  //
  // BB_SERVER_OWNED=1 means "a parent owns port 3000": reuse it, never start
  // or stop one. It overrides the CI branch deliberately, because the parent
  // has already guaranteed the server is up and serving a fresh build.
  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: process.env.BB_SERVER_OWNED === '1' || !process.env.CI,
    timeout: 180_000,
  },
});
