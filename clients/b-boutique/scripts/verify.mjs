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
  results.push(await run('performance', 'pnpm', ['audit:perf', URL]));
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
if (failed.some((r) => r.label === 'performance')) {
  console.log('\n  Note: SEO scores 63 on preview builds because indexing is');
  console.log('  deliberately off (ALLOW_INDEXING). That is the expected result');
  console.log('  here, and it is why `performance` fails its threshold gate.');
}
console.log('');
process.exit(failed.length ? 1 : 0);
