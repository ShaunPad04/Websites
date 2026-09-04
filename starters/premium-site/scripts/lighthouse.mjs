import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { ORIGIN, waitForServer } from "./server.mjs";

/**
 * Resolve the Chromium binary.
 *
 * The Playwright browser bundle is versioned (chromium-1194/...), so the
 * directory name cannot be hard-coded — it changes with every Playwright
 * upgrade. Fall back to chrome-launcher's own detection if nothing is found.
 */
function findChrome() {
  if (process.env.LIGHTHOUSE_CHROME_PATH) {
    return process.env.LIGHTHOUSE_CHROME_PATH;
  }

  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "/opt/pw-browsers";
  if (!existsSync(root)) return undefined;

  for (const entry of readdirSync(root)) {
    if (!entry.startsWith("chromium-")) continue;
    const candidate = join(root, entry, "chrome-linux", "chrome");
    if (existsSync(candidate)) return candidate;
  }

  return undefined;
}

/**
 * Lighthouse audit.
 *
 * Two guards matter more than anything else here:
 *
 * 1. A real HTTP response is confirmed BEFORE auditing. Lighthouse does not
 *    error on a refused connection — it happily audits the browser's error
 *    page and reports 0/0/0/0 with null metrics. That reads as catastrophic
 *    and means only that nothing was listening.
 *
 * 2. `runtimeError` is checked and fails loudly. Zeros are never published
 *    as if they were real performance data.
 */

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function runOnce(url, chrome) {
  const result = await lighthouse(
    url,
    {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: CATEGORIES,
    },
    undefined
  );

  const lhr = result?.lhr;
  if (!lhr) throw new Error("Lighthouse returned no result.");

  if (lhr.runtimeError && lhr.runtimeError.code !== "NO_ERROR") {
    throw new Error(
      `Lighthouse runtime error: ${lhr.runtimeError.code} — ${lhr.runtimeError.message}`
    );
  }

  const scores = {};
  for (const key of CATEGORIES) {
    const score = lhr.categories[key]?.score;
    if (score === null || score === undefined) {
      throw new Error(
        `Category "${key}" returned a null score — the page did not load correctly.`
      );
    }
    scores[key] = Math.round(score * 100);
  }

  const metric = (id) => lhr.audits[id]?.numericValue ?? null;

  return {
    scores,
    metrics: {
      fcp: metric("first-contentful-paint"),
      lcp: metric("largest-contentful-paint"),
      tbt: metric("total-blocking-time"),
      cls: metric("cumulative-layout-shift"),
      si: metric("speed-index"),
      tti: metric("interactive"),
    },
  };
}

export async function audit(url, samples = 3) {
  await waitForServer(url);

  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    chromePath: findChrome(),
  });

  try {
    const runs = [];
    for (let i = 0; i < samples; i++) {
      runs.push(await runOnce(url, chrome));
    }
    return runs;
  } finally {
    await chrome.kill();
  }
}

export function summarise(runs) {
  const out = { scores: {}, metrics: {} };

  for (const key of CATEGORIES) {
    const values = runs.map((r) => r.scores[key]);
    out.scores[key] = {
      median: median(values),
      min: Math.min(...values),
      max: Math.max(...values),
      samples: values,
    };
  }

  for (const key of Object.keys(runs[0].metrics)) {
    const values = runs
      .map((r) => r.metrics[key])
      .filter((v) => typeof v === "number");
    if (values.length === 0) continue;
    out.metrics[key] = {
      median: Math.round(median(values) * 100) / 100,
      min: Math.round(Math.min(...values) * 100) / 100,
      max: Math.round(Math.max(...values) * 100) / 100,
    };
  }

  return out;
}

export function report(summary) {
  const lines = [];
  lines.push("  Category scores (median of samples, with spread):");
  for (const [key, v] of Object.entries(summary.scores)) {
    lines.push(
      `    ${key.padEnd(15)} ${String(v.median).padStart(3)}   [${v.min}–${v.max}]  samples: ${v.samples.join(", ")}`
    );
  }
  lines.push("");
  lines.push("  Metrics (median, ms unless noted):");
  const labels = {
    fcp: "First Contentful Paint",
    lcp: "Largest Contentful Paint",
    tbt: "Total Blocking Time",
    cls: "Cumulative Layout Shift",
    si: "Speed Index",
    tti: "Time to Interactive",
  };
  for (const [key, v] of Object.entries(summary.metrics)) {
    const unit = key === "cls" ? "" : "ms";
    lines.push(
      `    ${(labels[key] ?? key).padEnd(26)} ${v.median}${unit}   [${v.min}–${v.max}]`
    );
  }
  return lines.join("\n");
}

// Direct invocation: `pnpm lighthouse [url] [samples]`
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2] ?? ORIGIN;
  const samples = Number(process.argv[3] ?? 3);

  audit(url, samples)
    .then((runs) => {
      console.log(`\nLighthouse — ${url} (${samples} samples)\n`);
      console.log(report(summarise(runs)));
      console.log("");
    })
    .catch((err) => {
      console.error(`\nLighthouse failed: ${err.message}\n`);
      process.exit(1);
    });
}
