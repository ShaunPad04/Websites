#!/usr/bin/env node
// The full verification sequence, against exactly one production server.
//
//   pnpm verify
//
// Build once → start one `next start` → wait until it genuinely answers →
// a11y, lint and Lighthouse all against that same server → tear it down, even
// on failure.
//
// Why this exists: `pnpm test:a11y` and `pnpm audit:perf` disagreed about who
// owned port 3000. Playwright's `webServer` block starts a server and kills it
// when the run ends, so running the two in sequence pointed Lighthouse at a
// dead port. Lighthouse does not error on a refused connection — it audits the
// browser's error page and reports 0/0/0/0 with null metrics, which looks like
// a catastrophic regression and is nothing of the sort.
//
// Here the parent owns the server for the whole sequence. `BB_SERVER_OWNED=1`
// tells playwright.config.ts to reuse it rather than start (and later kill)
// one of its own.

import { spawn } from 'node:child_process';
import { startServer, isServerUp, waitForQuiet } from './lib/server.mjs';

const URL = process.env.BB_VERIFY_URL ?? 'http://127.0.0.1:3000';

function run(label, command, args, env = {}) {
  return new Promise((resolve) => {
    console.log(`\n\x1b[1m── ${label} ${'─'.repeat(Math.max(0, 60 - label.length))}\x1b[0m`);
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ...env },
    });
    child.on('exit', (code) => resolve({ label, code: code ?? 1 }));
    child.on('error', () => resolve({ label, code: 1 }));
  });
}

const results = [];
let server = null;

try {
  // 1. Build first. The server we start must serve this build, not a stale one.
  const build = await run('build', 'pnpm', ['build']);
  results.push(build);
  if (build.code !== 0) {
    console.error('\n  Build failed — nothing else can be trusted. Stopping.\n');
    process.exit(1);
  }

  // 2. One server for the whole run.
  if (await isServerUp(URL)) {
    console.error(`\n  ✗ Something is already listening on ${URL}.`);
    console.error('    Stop it first — verification must own a server serving the build it just made.\n');
    process.exit(1);
  }
  console.log(`\n  starting production server at ${URL} …`);
  server = await startServer(URL);
  console.log(`  server ready (pid ${server.pid})`);

  // 3. Everything runs against that one server.
  //    BB_SERVER_OWNED stops Playwright taking ownership and killing it.
  results.push(await run('accessibility', 'pnpm', ['test:a11y'], { BB_SERVER_OWNED: '1' }));
  results.push(await run('lint', 'pnpm', ['lint']));

  // Lighthouse last, and only once the machine is quiet. Its simulated
  // throttling is calibrated against observed CPU, so auditing while
  // Playwright's browsers are still winding down reports timings that are
  // about the load on this box rather than about the site.
  process.stdout.write('\n  waiting for the machine to settle before the audit … ');
  const q = await waitForQuiet();
  console.log(q.quiet ? `load ${q.load.toFixed(2)}, go` : `still ${q.load.toFixed(2)} after timeout, auditing anyway`);
  results.push(await run('lighthouse', 'pnpm', ['audit:perf', URL]));
} finally {
  // 4. Release port 3000 whatever happened above.
  if (server) {
    console.log('\n  stopping server …');
    await server.stop();
    const stillUp = await isServerUp(URL);
    console.log(stillUp ? '  ⚠ port still occupied' : '  server stopped, port released');
  }
}

console.log(`\n\x1b[1m── summary ${'─'.repeat(52)}\x1b[0m\n`);
for (const { label, code } of results) {
  console.log(`  ${code === 0 ? '✓' : '✗'} ${label}`);
}

const failed = results.filter((r) => r.code !== 0);

// The lighthouse step gates on four categories at once, so a bare ✗ does not
// say which one gave way. One of them fails by design: with indexing off the
// page is noindex, SEO scores 63 against a threshold of 100, and the step can
// never pass. Say so — but only when it is actually true.
//
// This note used to print on any lighthouse failure and assert SEO was the
// cause. Run the gate with ALLOW_INDEXING=true and that becomes a lie: SEO
// scores 100 and it is performance that fails, and the note tells you to
// ignore it. A real regression could sit behind that sentence indefinitely.
// Now the reassurance is tied to the condition that earns it, and when
// indexing is on the summary points at the per-category lines instead.
if (failed.some((r) => r.label === 'lighthouse')) {
  if (process.env.ALLOW_INDEXING !== 'true') {
    console.log('\n  Note: SEO scores 63 here because indexing is deliberately off');
    console.log('  (ALLOW_INDEXING). That is expected, and on its own it is enough');
    console.log('  to fail the `lighthouse` step. To see the other three judged on');
    console.log('  their own merits, run: ALLOW_INDEXING=true pnpm verify');
  } else {
    console.log('\n  Note: indexing is on, so SEO is not the excuse. Read the four');
    console.log('  per-category lines above — whichever is marked ✗ is the real');
    console.log('  failure. Performance in particular is noisy: it has measured');
    console.log('  87-92 across runs on an unchanged build, so judge it on a median');
    console.log('  of several runs rather than on one.');
  }
}
console.log('');
process.exit(failed.length ? 1 : 0);
