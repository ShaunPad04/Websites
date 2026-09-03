// Production-server lifecycle for the verification scripts.
//
// The bug this exists to prevent: Playwright's `webServer` block owns the
// server it starts and kills it when the run ends. `audit:perf` then pointed
// Lighthouse at a dead port, and Lighthouse does not error on a refused
// connection — it audits the browser's error page and reports every category
// as 0 with null metrics. That looked exactly like a catastrophic performance
// regression and was purely an orchestration bug.
//
// So: never assume the port is live. Poll it, and own the process explicitly
// when nobody else does.

import { spawn } from 'node:child_process';

/**
 * Poll until the server answers with a real HTTP response, or give up.
 * A fixed sleep cannot work here — `next start` is ready in ~1s on a warm
 * build and >20s on a cold one, so any constant is either flaky or wasteful.
 *
 * Resolves true on the first non-5xx response, false on timeout.
 */
export async function waitForServer(url, { timeoutMs = 120_000, intervalMs = 250 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
      // A 5xx means the process is up but the build is broken; that is not
      // "ready", and auditing it would produce numbers nobody can act on.
      if (res.status < 500) return true;
    } catch {
      // Connection refused / reset / DNS — the server is not up yet.
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}

/** True if something is already answering on `url`. One shot, no polling. */
export async function isServerUp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2_000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Start `next start` and wait until it genuinely serves.
 *
 * Spawned `detached` so it leads its own process group: killing the group
 * (`-pid`) takes `next-server` and its workers with it. Killing just the pnpm
 * wrapper would orphan the Node server holding port 3000, which is the other
 * half of this class of bug.
 *
 * Returns a handle whose `stop()` is idempotent and safe to call from a
 * `finally` block.
 */
export async function startServer(url, { timeoutMs = 180_000, quiet = true } = {}) {
  const child = spawn('pnpm', ['start'], {
    detached: true,
    stdio: quiet ? 'ignore' : 'inherit',
    env: process.env,
  });
  child.unref();

  let exited = false;
  child.on('exit', () => { exited = true; });

  const handle = {
    pid: child.pid,
    async stop() {
      if (exited) return;
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        // Already gone, or the group was never created.
        return;
      }
      // Give it a moment to release the port, then insist.
      for (let i = 0; i < 40; i++) {
        if (exited) break;
        await new Promise((r) => setTimeout(r, 100));
      }
      if (!exited) {
        try { process.kill(-child.pid, 'SIGKILL'); } catch { /* gone */ }
      }
    },
  };

  const ready = await waitForServer(url, { timeoutMs });
  if (!ready) {
    await handle.stop();
    throw new Error(`Server did not become ready at ${url} within ${timeoutMs}ms`);
  }
  return handle;
}
