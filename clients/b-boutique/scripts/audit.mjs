#!/usr/bin/env node
// Lighthouse audit against a running dev/prod server.
//   pnpm audit:perf                     -> http://127.0.0.1:3000
//   pnpm audit:perf https://client.com  -> any URL
//
// Prints the four category scores and fails if any falls below THRESHOLDS.
// These are the numbers you put in front of a client.

import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'node:fs';

const THRESHOLDS = { performance: 90, accessibility: 100, 'best-practices': 95, seo: 100 };
const url = process.argv[2] ?? 'http://127.0.0.1:3000';

const chromePath =
  process.env.PLAYWRIGHT_BROWSERS_PATH
    ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium`
    : undefined;

const chrome = await launch({
  chromePath,
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const { lhr, report } = await lighthouse(url, {
    port: chrome.port,
    output: 'html',
    logLevel: 'error',
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 2.6 },
  });

  mkdirSync('.lighthouse', { recursive: true });
  writeFileSync('.lighthouse/report.html', report);
  // metrics-dump: the category score alone does not say what regressed.
  const m = ['first-contentful-paint','largest-contentful-paint','total-blocking-time',
             'cumulative-layout-shift','speed-index','mainthread-work-breakdown',
             'bootup-time','unused-javascript'];
  console.log('\n  metrics');
  for (const k of m) {
    const a = lhr.audits[k];
    if (a) console.log('   ', k.padEnd(28), (a.displayValue ?? '').padEnd(12), 'score', a.score);
  }

  console.log(`\nLighthouse — ${url}\n`);
  let failed = false;
  for (const [key, min] of Object.entries(THRESHOLDS)) {
    const score = Math.round((lhr.categories[key]?.score ?? 0) * 100);
    const ok = score >= min;
    if (!ok) failed = true;
    console.log(`  ${ok ? '✓' : '✗'} ${key.padEnd(15)} ${String(score).padStart(3)}  (min ${min})`);
  }
  console.log(`\n  Full report: .lighthouse/report.html\n`);
  process.exitCode = failed ? 1 : 0;
} finally {
  await chrome.kill();
}
