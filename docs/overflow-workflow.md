# Overflow Workflow — £0-first validation

**Status: validation / proof-of-concept.** This document describes an *optional*
overflow lane for routine implementation. It changes nothing about how premium-webdev
work is normally done. Opus remains in charge. Read this whole file before using the lane.

---

## 1. The hierarchy — this is the point of the whole system

### Opus 5 = Creative Director (exclusive authority)

Opus, and only Opus, owns every decision that affects how the site **looks or feels**:

- brand direction
- visual design
- UI / UX
- typography
- colour system
- layout composition
- hero design
- motion direction
- GSAP choreography
- animation timing / easing
- design tokens
- premium responsive decisions
- final visual QA
- **merge approval**

### Overflow model = Implementer only

The overflow model may only carry out work Opus has already decided and specified:

- approved component implementation
- TypeScript fixes
- tests
- accessibility fixes
- refactors
- content / copy swaps
- repetitive engineering
- straightforward implementation **explicitly specified by Opus**

### THE HARD RULE

> **If a decision changes how the website LOOKS or FEELS, the overflow model does NOT decide it.**

The overflow model must **never**:

- redesign anything
- simplify approved visual work
- change typography
- change colours
- alter spacing / design tokens
- remove premium interactions
- change GSAP choreography
- invent timing / easing
- alter hero composition
- reinterpret responsive art direction
- replace sophisticated approved UI with generic components

> **If an approved specification is ambiguous: STOP AND REPORT. DO NOT IMPROVISE.**

Ambiguity is not permission. A missing value is a question for Opus, never a choice
for the implementer.

### The implementer must read and obey

The overflow model inherits the repository's existing guidance and must follow it:

- `CLAUDE.md` (project rules, hard bans, routing)
- `premium-motion-direction` skill
- `frontend-design-skill` guidance where relevant
- responsive / Tailwind guidance (`tailwind-ui-rules`)
- the official `gsap-*` skills when touching motion
- Ponytail implementation policy — **plumbing only, never art-direction reduction**

Ponytail governs *how plainly to build the plumbing*. It never licenses removing or
simplifying intentional craft. GSAP, ScrollTrigger, SplitText, Lenis, custom cursors,
page transitions and cinematic interaction stay when the approved design calls for them.

---

## 2. Architecture

```
NORMAL (Claude available)
  Opus (creative director)
    -> writes approved implementation spec
    -> pushes spec / opens task on GitHub  (client/b-boutique)
    -> reviews the diff, runs final visual QA, merges

OVERFLOW / POST-CAP (browser only, no Anthropic usage)
  Browser
    -> GitHub Codespaces (browser VS Code)
    -> Cline (or Roo Code) extension
    -> OmniRoute on 127.0.0.1:20128   (never publicly forwarded)
    -> free coding-model fallback pool
    -> same premium-webdev repository, same client/b-boutique branch
```

Opus and the overflow lane **coordinate through the GitHub repository**, not a live
network socket. Opus pushes specs and reviews PRs; the implementer works on the branch.
This is deliberate: it needs no direct connection from a hosted Claude session to the
Codespace, and it keeps working after the Anthropic cap because the implementer lane
does not depend on Claude at all.

---

## 3. Free provider pool (validation only)

OmniRoute auto-fallback rolls to the next provider when one hits its rate limit:

```
Gemini Flash  ->  Cerebras GLM-4.7  ->  Mistral Codestral  ->  OpenRouter (free)
```

- **Primary — Gemini 2.x Flash** (Google AI Studio free): large context, drives Cline
  agentically over the repo.
- **Secondary — Cerebras GLM-4.7 free**: strong model, small (~8K) free context — use
  for single-file / short tasks, not whole-repo runs.
- **Fallback — Mistral Codestral free**, then **OpenRouter free** as the last hop.

Model IDs and limits drift. Confirm the live catalogue before relying on any single one:

```bash
omniroute models          # list what your connected providers expose
omniroute simulate "..."  # dry-run which provider would be picked
```

Turn OmniRoute token compression **off** for this use — it can corrupt design specs.

### FREE PROVIDER WARNING

> **FREE PROVIDERS ARE FOR WORKFLOW VALIDATION / NON-SENSITIVE TEST CODE UNLESS THEIR
> CURRENT TERMS HAVE BEEN VERIFIED FOR CLIENT USE.**

Most free tiers may train on, log, or retain your inputs, and some forbid commercial
use. **Do not route real B Boutique client code through a provider classified as unsafe
or unclear for commercial / client privacy.** During validation, use throwaway /
non-sensitive test code only.

Current classification (verify before trusting — terms change):

| Provider (free tier) | Trains on input | Client-code verdict |
|---|---|---|
| Gemini Flash (AI Studio free) | Yes | DO NOT USE for client code |
| Cerebras GLM-4.7 free | Unclear | CAUTION |
| Mistral Codestral free | Yes (unless opted out) | DO NOT USE for client code |
| OpenRouter free variants | Often | CAUTION -> DO NOT USE |

**Paid GLM-5.2 (z.ai — no training on inputs) remains the intended later client-safe
overflow upgrade** unless a better verified option exists. Switching to it is a single
provider/key swap in OmniRoute — the Codespace, Cline, and repo are unchanged.

---

## 4. Secrets

Provider credentials live **only** in **GitHub Codespaces Secrets**, injected as
environment variables at Codespace start. They must never appear in `devcontainer.json`,
git, `CLAUDE.md`, committed `.env` files, documentation, logs, or shell history.

Placeholder variable names only (you set the real values in Codespaces Secrets, never here):

- `OMNIROUTE_API_KEY` — OmniRoute's own access token
- `GEMINI_API_KEY` — primary free provider (validation)
- `CEREBRAS_API_KEY` — secondary free provider (validation)
- `MISTRAL_API_KEY` — fallback free provider (validation)
- `OPENROUTER_API_KEY` — last-hop free provider (validation)

To add one: GitHub → Settings → Codespaces → Secrets → New secret, scoped to this repo.
To rotate/remove: change or delete it there and restart the Codespace. Nothing in the
repo changes.

---

## 5. Starting OmniRoute inside a Codespace

The devcontainer does **not** auto-start OmniRoute (auto-start on every create is fragile
and can hang Codespace startup). Start it by hand when you want the lane, in a terminal:

```bash
omniroute serve --port 20128    # binds loopback via OMNIROUTE_SERVER_HOST
```

**Loopback binding is required.** OmniRoute is a Next standalone server that listens on
`0.0.0.0` by default. The devcontainer sets `OMNIROUTE_SERVER_HOST=127.0.0.1`
(`containerEnv`), which makes `omniroute serve` bind `127.0.0.1` only — verified: with it
set, the listen address is `127.0.0.1` and OmniRoute's own `SECURITY: listening on 0.0.0.0`
warning does not fire. If you ever run OmniRoute outside this devcontainer, set that
variable yourself first:

```bash
OMNIROUTE_SERVER_HOST=127.0.0.1 omniroute serve --port 20128
```

Then point Cline at `http://127.0.0.1:20128/v1`, model `auto` (or a specific free ID).
The port is **not forwarded at all** — Cline and OmniRoute share the Codespace, so nothing
needs to leave it. **Never add a public port forward for 20128.**

---

## 6. Post-cap test — proving Claude is not needed

Run this with **no active hosted Claude session**. That independence is the entire point.

1. Open GitHub Codespaces from the browser.
2. Set a Codespaces **spending limit of $0** first (see §7).
3. Open Cline / Roo in browser VS Code.
4. `omniroute serve --port 20128` in a terminal; point Cline at it.
5. Give the model a small **implementation-only** task on **test code** (e.g. "add a unit
   test for this pure helper", "fix this TypeScript error").
6. Model edits code.
7. Run `pnpm build` / `pnpm test`.
8. Review the diff in the VS Code Source Control panel.
9. Commit and push to `client/b-boutique` from the Source Control panel.

If all nine steps complete without Claude, the fallback is proven.

---

## 7. £0 guardrails

- **Codespaces spending limit must be $0** — GitHub then hard-stops instead of charging.
- Use the **2-core** machine.
- **Stop the Codespace when finished** (or rely on the 30-min idle auto-stop).
- Keep storage within the included 15 GB (keep one Codespace; delete when done).
- **No paid provider** during validation.
- **Never publicly forward port 20128.**

---

## 8. Scope — what the lane may and may not touch

Two different activities, two different rules. Do not conflate them.

### Setup / infrastructure creation (standing up the overflow lane itself)

Must **not** alter B Boutique **application source**, and must never touch the existing
skills (`premium-motion-direction`, `gsap-*`, Ponytail, Graphify, Strix), the design
system, or `CLAUDE.md`. Setting up the lane only adds/edits its own infrastructure
(`docs/overflow-workflow.md`, `.devcontainer/`).

### Actual approved overflow tasks (running the lane)

The overflow implementer **may edit B Boutique source** — that is the entire purpose —
but only under strict limits:

- **only** where required by an **explicit, Opus-approved implementation spec**;
- **may not** make independent visual or design decisions (see the hard rule in §1);
- **may not** touch the existing skills, the design system, or `CLAUDE.md`;
- **ambiguity = STOP AND REPORT.** A missing or unclear value is a question for Opus,
  never a choice for the implementer.

In short: the implementer changes application code to realise an approved spec; it never
reshapes the project, the design language, or the tooling on its own initiative.
