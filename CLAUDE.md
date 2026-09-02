# Websites

Premium client website work. Skills in `.claude/skills/` load automatically.

## Layout

- `starters/premium-site/` — Next.js 16 + React 19 + TypeScript + Tailwind v4 starter.
  Copy to `clients/<name>/` to begin a project. Do not build directly in the starter.
- `.claude/skills/` — 21 skills, one job each. Provenance in `CREDITS.md` there.
- `.claude/skills/00-design-references/` — shared data, not a skill. Read by `website-rebuild`,
  `local-business-rebuild` and `design-system-generator`.
- `.claude/skills/00-impeccable-extensions/` — 8 legacy reference documents current upstream
  `impeccable` no longer ships. Not a skill; nothing loads it automatically. See its README.

---

## Skill routing — read this before invoking any design skill

These skills have overlapping descriptions and will all try to claim a design request.
**They are not peers.** Use this precedence. One skill drives; the rest are reference or
explicitly invoked.

### One driver per request

| The request | The skill that drives | Everything else |
|---|---|---|
| Build any new UI | `frontend-design-skill` | It is a *conductor* — it calls the others and holds an 8-item evidence gate. Let it orchestrate. |
| Build a landing / marketing page | `website` | Narrative structure, hero thesis, conversion arc. Still satisfy the gate. |
| Rebuild an existing site from a URL | `website-rebuild` | 14-phase pipeline. Owns the whole job end to end. |
| Rebuild a *local business* site | `local-business-rebuild` | 10-phase variant tuned for speculative local pitches. Use instead of `website-rebuild`, never alongside it. |
| Change existing UI | `impeccable <verb>` | See below. |
| Motion graphics / video | `remotion-motion-graphics` | Unrelated to the web skills. No conflict. |
| Complex feature engineering | `feature-dev` | Auth, booking, CMS, ecommerce, APIs, dashboards, portals. **Engineering only — it must never drive visual design.** |
| Browser / runtime bug | `chrome-devtools` | Inspection and debugging. Never a design driver. |
| Post-implementation cleanup | `/simplify` | Runs after tests pass, before visual regression. |

### `impeccable` owns all refinement verbs

`impeccable` is the umbrella for 17 refinement modes, each in `impeccable/reference/`:

`adapt` `animate` `audit` `bolder` `clarify` `colorize` `critique` `delight` `distill`
`harden` `layout` `optimize` `overdrive` `polish` `quieter` `shape` `typeset`

Invoke as `impeccable polish`, `impeccable audit`, `impeccable shape`. These were removed
as standalone skills precisely so they stop competing with their own parent — do not
reinstall them.

### Never drivers — reference only

Read these for knowledge. They must not take over a request:

| Skill | Consulted for |
|---|---|
| `ui-ux-pro-max` | **Data lookup, via its scripts.** 84 styles, 192 palettes, 74 font pairings, 17 GSAP presets, 22 stacks. Run the script; never guess these values from memory. |
| `high-end-visual-design` | What makes a site read as expensive; the defaults that read as cheap. |
| `emil-design-eng` | Component craft and the invisible details. |
| `apple-design-hig` | 53 Apple HIG documents. Cite them; don't let them drive a web layout. |
| `tailwind-ui-rules` | Tailwind implementation correctness. Its own description claims it "must always be active" — treat that as *consult during implementation*, not as a licence to drive direction. |
| `design-libera` | LIBERA Studio methodology — Build/Audit/Redesign/Study modes, 10 Vibe Archetypes, G/B/P/H gate IDs, OKLCH strategy, the Fingerprint Test, brand-register catalogue. **Reference only.** Its description reads like a driver; it is not one. Its seven `/ui-ux-libera` references resolve to `ui-ux-pro-max` — see below. |
| `responsive-design` | Breakpoint system, container queries, fluid typography, responsive images, the table→card pattern. Consult when building cross-device layout; it does not claim the build. |

### Explicitly invoked only — never self-trigger

| Skill | When |
|---|---|
| `visual-preview` | You want a client-facing HTML review artefact. |
| `web-design-guidelines` | A review pass against Vercel's Web Interface Guidelines. |
| `design-system` | Building or extending a token architecture. |
| `brand` | Brand voice, messaging, identity rules. |
| `brandkit` | Generating brand-guideline boards and identity imagery. |
| `imagegen-frontend-web` | Generating per-section reference imagery before building. |
| `theme-factory` | Applying one of 10 preset themes, or generating a theme, for slides/docs/landing artifacts. |
| `design-system-generator` | Producing a machine-readable `DESIGN.md` that a build pipeline consumes. |
| `full-output-enforcement` | **Explicit only.** Bans placeholder code and truncated output. Use when you need a complete, unabridged deliverable — never as a default, or ordinary incremental edits balloon. |

### `design-libera` dependency routing

`design-libera`'s SKILL.md references `/ui-ux-libera` seven times as an optional companion.
**That skill is deliberately not installed.** It is a fork of `ui-ux-pro-max` v2.5.0 whose
databases and scripts are smaller than ours in every single file — its `core.py` is 12 KB
against our 41 KB.

**Resolve every `/ui-ux-libera` reference to `ui-ux-pro-max` instead.** The upstream
`design-libera` source is unmodified on purpose; this routing rule is the fix. Its own
description already calls those references optional, so nothing breaks.

### Account-synced skills also load

`frontend-design`, `design-lead`, `apple-design`, `figma-implement-design` and
`motion-design` sync from the claude.ai account and are not in this repo. `design-lead` and
`frontend-design` overlap `frontend-design-skill` directly. **In this repo,
`frontend-design-skill` wins** — it has the evidence gate. Disable the synced ones in
claude.ai settings if the overlap becomes noisy.

---

## Project flow

1. `impeccable shape` — structured discovery. Never skip this on client work.
2. `ui-ux-pro-max` scripts — palette, type pairing, style direction:
   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "luxury architecture studio" --domain style
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "wellness spa" --design-system --project-name "Serenity"
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "scroll reveal" --domain gsap
   ```
3. `frontend-design-skill` or `website` — the build.
4. `impeccable critique` / `impeccable audit` / `web-design-guidelines` — review.
5. `pnpm test:a11y && pnpm audit:perf` — the objective numbers.
6. `/simplify` — post-implementation cleanup, once tests pass.
7. `pnpm test:visual` — confirm nothing moved that you did not intend to move.
8. `/security-review` or the tiered `security-guidance` layers — before production.
9. `visual-preview` — the client review artefact.

## Testing

| Command | What it covers |
|---|---|
| `pnpm build` | Typecheck + RSC errors. Run before calling any UI work finished. |
| `pnpm test:a11y` | WCAG 2.1 A/AA via axe-core, plus keyboard navigation, at all 3 viewports. |
| `pnpm test:visual` | Visual regression via native `toHaveScreenshot()`. |
| `pnpm test:visual:update` | Accept new baselines. **Review the diff in `test-results/` first** — a baseline accepted unseen is a regression you have agreed to. |
| `pnpm test:all` | Everything. |
| `pnpm audit:perf` | Lighthouse: perf ≥90, a11y 100, best-practices ≥95, SEO 100. |

Visual baselines live in `tests/visual.spec.ts-snapshots/<project>/` and are per-viewport.
`tests/helpers/stabilise.ts` pins the five things that would otherwise make them rot: GSAP's
ticker and ScrollTrigger, Lenis, pending timers (the New In rail advances itself), web fonts,
and lazy images — plus `pinClock()` for the footer's `new Date().getFullYear()`.

**Multi-page SEO crawling** (Unlighthouse or similar) is a **per-project** decision, not a
global install. Lighthouse already gates single-page SEO at 100. Add a crawler only when a
site genuinely has enough pages to warrant one.

## Security — tiered, and deliberately not automatic

`security-guidance` is installed with **three independently switchable layers**:

| Tier | When | Setting | Cost |
|---|---|---|---|
| Ordinary frontend work | CSS, layout, copy | Layer 1 only — pattern rules | Free, no model calls |
| Security-sensitive feature | auth, forms, uploads, APIs, payments, webhooks, secrets, env vars, DB | Unset `ENABLE_CODE_SECURITY_REVIEW` for that session | One review call per turn |
| Pre-production | Before a client site ships | Full review + `/security-review` | Highest |

**Default in `.claude/settings.json` is `ENABLE_CODE_SECURITY_REVIEW=0`** — layer 1 only, so a
CSS edit never triggers an expensive LLM review. The review model is `claude-opus-4-7` via
`SECURITY_REVIEW_MODEL`. `SECURITY_GUIDANCE_DISABLE=1` kills the plugin entirely.

## Conventions

- pnpm. App Router, `src/`, `@/*` alias.
- Run `pnpm build` before calling UI work finished — it typechecks and catches RSC errors.
- Run `pnpm test:a11y` before showing a client anything. WCAG AA is a floor, not a goal.

## Motion

`motion` (React), `gsap` (scroll narrative), `lenis` (smooth scroll) are in the starter.
`ui-ux-pro-max` ships 17 GSAP presets — search them rather than inventing timings.
Always honour `prefers-reduced-motion`; `impeccable animate` covers the craft rules.

## Hard bans carried by these skills

No emoji as icons or decoration — SVG only. Not Inter + Roboto as the display/body pair.
No `slate-*` as a palette. No purple-to-blue gradients. No lorem ipsum or grey placeholders
in anything presented as finished. One heroic effect per screen.

## Environment

- Claude Code web sessions are ephemeral: only committed work survives. Never install skills
  to `~/.claude/skills/` here — vendor into `.claude/skills/` and commit.
- Playwright and Chromium are preinstalled system-wide (`/opt/pw-browsers`).
  **Never run `playwright install`** in a web session. `playwright.config.ts` already points
  at the system binary via `PLAYWRIGHT_BROWSERS_PATH`.
- `remotion-motion-graphics` needs `remotion @remotion/cli react react-dom` per project.
- **Plugins do not survive a session.** `chrome-devtools`, `security-guidance` and
  `feature-dev` install to `~/.claude/`, which is wiped with the container. Reinstall:
  ```bash
  claude plugin marketplace add anthropics/claude-code
  claude plugin install security-guidance@claude-code-plugins
  claude plugin install feature-dev@claude-code-plugins
  claude plugin marketplace add ChromeDevTools/chrome-devtools-mcp
  claude plugin install chrome-devtools-mcp@chrome-devtools-plugins
  ```
- **Chrome DevTools in this container** needs two workarounds. Puppeteer's pipe transport
  fails here (`Target closed`), so point the server at a Chrome you launch yourself:
  ```bash
  ln -sf /opt/pw-browsers/chromium-1194/chrome-linux/chrome /opt/google/chrome/chrome
  setsid /opt/google/chrome/chrome --headless --no-sandbox --disable-gpu \
    --remote-debugging-port=9222 --user-data-dir=/tmp/cdt-profile about:blank &
  ```
  then add `--browserUrl http://127.0.0.1:9222` to the server args in the plugin's
  `mcp.json`. On a normal machine neither workaround is needed.

## Per-project, never global

shadcn/ui · Sentry · Stripe · CMS · Supabase · database/ORM · auth providers · email · SMS ·
CRM · analytics · consent tooling · search services · Unlighthouse · Remotion packages.

Install these inside `clients/<name>/` when a brief calls for them. shadcn/ui in particular is
right for dashboards and SaaS and wrong for bespoke luxury marketing — it carries a
recognisable house look.
