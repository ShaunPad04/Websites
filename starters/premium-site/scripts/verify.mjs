import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ORIGIN,
  PORT,
  startServer,
  waitForServer,
  assertPortFree,
} from "./server.mjs";
import { audit, summarise, report } from "./lighthouse.mjs";

/**
 * THE GATE
 *
 * One command that answers: is this shippable?
 *
 *   content integrity → typecheck → lint → build
 *     → start ONE production server → poll for a real response
 *     → axe/responsive tests → Lighthouse (3 samples)
 *     → teardown in `finally` → confirm the port is free
 *
 * The server is started once and owned here. Playwright is told to reuse it
 * via VERIFY_OWNS_SERVER so it cannot tear the server down before the
 * Lighthouse pass runs against it.
 */

const results = [];
let failed = false;

function step(name, fn) {
  process.stdout.write(`\n▸ ${name}\n`);
  try {
    const ok = fn();
    results.push([name, ok ? "pass" : "fail"]);
    if (!ok) failed = true;
    return ok;
  } catch (err) {
    console.error(`  ${err.message}`);
    results.push([name, "fail"]);
    failed = true;
    return false;
  }
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: "inherit", env: process.env });
  return res.status === 0;
}

/**
 * Content integrity gate.
 *
 * Unverified testimonials or portfolio entries are fine on a preview build —
 * they are hidden by their flags. They are NOT fine on a build that declares
 * itself indexable, because that is production.
 */
function checkContentIntegrity() {
  const content = readFileSync(
    join(process.cwd(), "src", "lib", "content.ts"),
    "utf8"
  );

  const flag = (name) =>
    new RegExp(`export const ${name} = (true|false)`).exec(content)?.[1] ===
    "true";

  const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
  const unverified = [
    ["TESTIMONIALS_VERIFIED", flag("TESTIMONIALS_VERIFIED")],
    ["PORTFOLIO_VERIFIED", flag("PORTFOLIO_VERIFIED")],
    ["PRICING_CONFIRMED", flag("PRICING_CONFIRMED")],
  ].filter(([, verified]) => !verified);

  if (unverified.length === 0) {
    console.log("  All content flags verified.");
    return true;
  }

  const names = unverified.map(([n]) => n).join(", ");

  if (indexable) {
    console.error(
      `  BLOCKER — the build is marked indexable but these are still unverified: ${names}`
    );
    return false;
  }

  console.log(
    `  Preview build. Unverified (hidden from the page): ${names}`
  );
  console.log("  These must be confirmed before NEXT_PUBLIC_SITE_INDEXABLE=true.");
  return true;
}

async function main() {
  console.log("\n══ VERIFICATION GATE ══");

  step("Content integrity", checkContentIntegrity);
  step("Typecheck", () => run("pnpm", ["typecheck"]));
  step("Lint", () => run("pnpm", ["lint"]));

  if (!step("Production build", () => run("pnpm", ["build"]))) {
    console.error("\nBuild failed — nothing downstream can be measured.\n");
    process.exit(1);
  }

  const server = startServer();

  try {
    process.stdout.write(`\n▸ Server readiness (${ORIGIN})\n`);
    const status = await waitForServer(ORIGIN);
    console.log(`  Responding with HTTP ${status}.`);
    results.push(["Server readiness", "pass"]);

    step("Accessibility & responsive tests", () => {
      // Tell Playwright the server is already owned here, so it reuses it and
      // does not kill it before the Lighthouse pass below.
      process.env.VERIFY_OWNS_SERVER = "1";
      return run("pnpm", ["exec", "playwright", "test"]);
    });

    process.stdout.write("\n▸ Lighthouse (3 samples)\n");
    try {
      const runs = await audit(ORIGIN, 3);
      console.log(report(summarise(runs)));
      results.push(["Lighthouse", "pass"]);
    } catch (err) {
      console.error(`  ${err.message}`);
      results.push(["Lighthouse", "fail"]);
      failed = true;
    }
  } catch (err) {
    console.error(`\n  ${err.message}`);
    console.error(server.getLog().slice(-2000));
    results.push(["Server readiness", "fail"]);
    failed = true;
  } finally {
    // Teardown must happen even when an audit above threw, or the port stays
    // held and the next run fails for an unrelated-looking reason.
    server.stop("SIGTERM");
    let free = await assertPortFree(ORIGIN, { timeoutMs: 5000 });

    if (!free) {
      // A server that ignored SIGTERM would silently poison the next run,
      // which then fails for a reason that looks nothing like the cause.
      server.stop("SIGKILL");
      free = await assertPortFree(ORIGIN, { timeoutMs: 5000 });
    }

    console.log(
      free
        ? `\n▸ Port ${PORT} released.`
        : `\n▸ WARNING: port ${PORT} still responding after SIGKILL — another process owns it.`
    );
  }

  console.log("\n══ SUMMARY ══");
  for (const [name, state] of results) {
    console.log(`  ${state === "pass" ? "PASS" : "FAIL"}  ${name}`);
  }
  console.log("");

  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
