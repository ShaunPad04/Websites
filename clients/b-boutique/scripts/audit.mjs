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
import { isServerUp, startServer, waitForServer } from './lib/server.mjs';

const THRESHOLDS = { performance: 90, accessibility: 100, 'best-practices': 95, seo: 100 };
const url = process.argv[2] ?? 'http://127.0.0.1:3000';

// Lighthouse must never run against a dead port. A refused connection is not
// an error to Lighthouse — it audits the browser's error page and scores every
// category 0 with null metrics, which reads as a total regression and is not
// one. So confirm a real HTTP response first, always.
//
// If the URL is already served (by `pnpm verify`, by Playwright's reused
// server, or by a dev running `pnpm start`), use it and leave it alone —
// whoever started it owns it. Only when nothing answers, and only for a local
// URL, does this script start its own server and take responsibility for
// stopping it.
const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(url);
let ownedServer = null;

if (await isServerUp(url)) {
  console.log(`  server already running at ${url} — reusing it`);
} else if (isLocal) {
  console.log(`  nothing serving ${url} — starting one`);
  ownedServer = await startServer(url);
  console.log(`  server ready (pid ${ownedServer.pid})`);
} else {
  // A remote target we cannot start. Poll briefly in case it is warming up,
  // then fail loudly rather than publishing a zero-score audit of an error page.
  if (!(await waitForServer(url, { timeoutMs: 30_000 }))) {
    console.error(`\n  ✗ ${url} is not responding. Refusing to audit an error page.\n`);
    process.exit(1);
  }
}

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

  // Belt and braces. The readiness poll above should make this unreachable,
  // but if Lighthouse ever does audit an error page, say so instead of
  // printing four zeros that look like a regression.
  if (lhr.runtimeError) {
    console.error(`\n  ✗ Lighthouse could not load ${url}`);
    console.error(`    ${lhr.runtimeError.code}: ${lhr.runtimeError.message}\n`);
    process.exit(1);
  }

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
  // Only stop what this script started. A server someone else owns stays up.
  if (ownedServer) await ownedServer.stop();
}
