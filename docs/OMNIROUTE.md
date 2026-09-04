# OmniRoute — model / token routing

**Category: MODEL / TOKEN ROUTING.** Not a design skill, not counted among the
33 account-synced skills, not part of the skill-routing architecture.

Audited 2026-09-04. **Verified before recommending — not assumed.**

---

## Audit result

| Item | Result |
|---|---|
| Installed in this environment? | **No** — no binary, no npm package (global or local), no `~/.omniroute` or `~/.config/omniroute`, no `OMNI*` env var, no reference in `launcher-settings.json` |
| Installed version | n/a |
| Official source | [`diegosouzapw/OmniRoute`](https://github.com/diegosouzapw/OmniRoute) (MIT) |
| Current version audited | **3.8.51** (`package.json`), latest tag `v3.8.9` at clone SHA `c41ec7f862f66f00f562b4b8a66ec9d450a7416e` |
| Integration method | Local HTTP gateway: `export ANTHROPIC_BASE_URL="http://localhost:20128"` |
| Cloud persistent? | **No** — see below |
| Bootstrap required? | **No — deliberately excluded.** See below |
| Conflicts found? | **Yes, material.** See below |
| Verified? | Installation state and integration method verified. **Runtime behaviour not tested — nothing was installed.** |

`ANTHROPIC_BASE_URL` *is* set in managed cloud sessions, but by the Claude Code
platform's own gateway. That is not OmniRoute.

---

## How it works, and why that matters here

OmniRoute is a **local-first gateway**. It runs a server on `localhost:20128`
exposing an Anthropic-compatible endpoint, and you point Claude Code at it by
overriding `ANTHROPIC_BASE_URL`. It then fans requests out to 352 providers /
1200+ models (Kimi, GLM, DeepSeek, MiniMax, GPT, Gemini and others, many free
tier), with quota-aware fallback and RTK+Caveman prompt compression.

Three consequences follow directly from that design.

### 1. It cannot persist in managed cloud containers

It needs a long-lived local process. A managed Claude Code cloud container is
disposable, has no supervisor for a background gateway, and already sets
`ANTHROPIC_BASE_URL` to the platform gateway. There is no supported way to keep
OmniRoute running across fresh containers.

**Where it does work well: your own machine** — local Claude Code CLI, or the
desktop app, where you control the process and the environment.

### 2. Overriding `ANTHROPIC_BASE_URL` in a managed session is not safe

Doing so redirects Claude Code away from the platform gateway that this session
authenticates against. Expect broken auth at best. This is why OmniRoute is
**not** in `scripts/bootstrap-claude-plugins.sh` — the bootstrap is designed to
be safe to run in any fresh cloud container, and adding OmniRoute would make it
unsafe.

### 3. Two risks specific to £10k+ client work

Stated plainly so the decision is yours:

- **Confidentiality.** Routing a request to a third-party provider sends the
  prompt — client brief, brand strategy, unreleased copy, source code — to that
  provider. Free tiers frequently reserve the right to train on submitted data.
  For client work under any confidentiality expectation, that is a real exposure,
  not a theoretical one.
- **Compression.** RTK/Caveman compression rewrites prose and repetitive tool
  output (code blocks, URLs and structured JSON are documented as byte-perfect).
  Design and copy work *is* prose. Compressing the brief is precisely where
  quality loss would be invisible until it reaches the client.

Neither point makes OmniRoute bad software. Both make it a poor fit for the
client-facing half of this environment.

---

## Recommendation

**Documentation and configuration only. Not installed, not bootstrapped.**

Split the goal in two:

### For the quality/cost tiering you actually want — use native model selection

Claude Code's built-in model control achieves the tiering with no third-party
routing, no confidentiality exposure and no persistence problem:

| Tier | Work | Model |
|---|---|---|
| **Routine / low-risk** | file reads, code search, formatting, obvious CSS, running tests, lint fixes, deterministic refactors | Haiku 4.5 — `/model claude-haiku-4-5-20251001` |
| **Medium** | component implementation, responsive fixes, standard frontend, ordinary debugging, test authoring | Sonnet 5 — `/model claude-sonnet-5` |
| **High-value / high-reasoning** | £10k+ creative direction, premium homepage architecture, hard UX calls, major redesign, advanced GSAP choreography, difficult debugging, engineering architecture, security-sensitive systems, final critique, pre-launch QA | Opus 5 — `/model claude-opus-5` |

Per-subagent overrides let a cheap model do the fan-out while an expensive one
does the judgement, in the same task.

**Maximum-quality path — always one step, never obstructed:**
```
/model claude-opus-5
```
Nothing in this environment routes around that, downgrades it, or makes it
harder to reach. That was a requirement, and native selection satisfies it by
construction.

### If you still want OmniRoute — run it locally, not in cloud

```bash
# on your own machine only
npx omniroute@3.8.51            # or per current upstream install docs
export ANTHROPIC_BASE_URL="http://localhost:20128"
claude
```

Guidance if you do:
- Use it for **personal/experimental** work, not client deliverables.
- Never point a client project's session at it while confidentiality applies.
- Verify the version first — it moves fast; `3.8.51` was current at audit.
- **Bypass:** `unset ANTHROPIC_BASE_URL` returns Claude Code to the normal
  Anthropic endpoint. That is the maximum-quality escape hatch.

---

## OmniRoute vs skill routing — kept separate

They answer different questions and must not be conflated.

| | Decides | Example: *"Build a premium homepage"* | Example: *"Fix three type errors"* |
|---|---|---|---|
| **Skill routing** (`docs/ROUTING.md`) | *What expertise owns the task* | `frontend-design-skill` | engineering / testing |
| **Model routing** (this file) | *Which model does the work* | Opus 5 — high-value creative | Haiku 4.5 — deterministic |

Model routing must never override the one-driver-per-task architecture. Choosing
a cheaper model does not change **who owns** the task.

---

## If OmniRoute is later adopted

Any bootstrap must be idempotent and must follow the same discipline as the
plugin bootstrap:

```
check OmniRoute
  → correct version present  → no-op
  → missing or stale         → report (or restore via the official method)
  → verify
  → continue
```

Do **not** add an unverified `SessionStart` auto-installer. The plugin bootstrap
is deliberately explicit for the same reason.

## Sources

- <https://github.com/diegosouzapw/OmniRoute>
- <https://github.com/diegosouzapw/OmniRoute/wiki/Claude-Code-Configuration>
- <https://github.com/diegosouzapw/OmniRoute/blob/main/docs/guides/USER_GUIDE.md>
