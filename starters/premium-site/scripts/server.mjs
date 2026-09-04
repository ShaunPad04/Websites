import { spawn } from "node:child_process";

export const PORT = Number(process.env.VERIFY_PORT ?? 3000);
export const ORIGIN = `http://127.0.0.1:${PORT}`;

/**
 * Poll for a real HTTP response.
 *
 * Never a fixed sleep: a cold start takes many times longer than a warm one,
 * so any constant is either flaky or wasteful, and neither actually tells you
 * the server is ready to serve.
 */
export async function waitForServer(url, { timeoutMs = 90_000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastError = "no attempt made";

  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status > 0 && res.status < 500) return res.status;
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  throw new Error(
    `Server at ${url} was not ready within ${timeoutMs}ms. Last error: ${lastError}`
  );
}

/**
 * Start the production server detached, so the whole process group can be
 * killed. Without this an orphaned Node process keeps the port and the next
 * run fails for a reason that looks nothing like the real cause.
 */
export function startServer() {
  const child = spawn("pnpm", ["start", "--port", String(PORT)], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
    env: { ...process.env, PORT: String(PORT) },
  });

  let log = "";
  child.stdout?.on("data", (d) => (log += d.toString()));
  child.stderr?.on("data", (d) => (log += d.toString()));

  return {
    child,
    getLog: () => log,
    stop(signal = "SIGTERM") {
      if (child.pid === undefined) return;
      try {
        // Negative PID targets the whole process group: `pnpm start` spawns
        // `next start`, which spawns the actual server. Signalling only the
        // direct child leaves the grandchild holding the port.
        process.kill(-child.pid, signal);
      } catch {
        try {
          child.kill(signal);
        } catch {
          /* already gone */
        }
      }
    },
  };
}

/** Confirm the port is genuinely free after teardown. */
export async function assertPortFree(url, { timeoutMs = 10_000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(url, { redirect: "manual" });
    } catch {
      return true;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}
