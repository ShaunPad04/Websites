@AGENTS.md

# Premium client website

Generic starter. Copy to a new project directory and build the client site
there — do not build inside the starter itself.

Canonical environment: [`ShaunPad04/premium-webdev`](https://github.com/ShaunPad04/premium-webdev).

---

## First run in a fresh Claude Code cloud session

Account-synced skills load automatically. Plugins do not — `~/.claude` is wiped
when a managed container is recycled. One explicit command restores them:

```bash
bash scripts/bootstrap-claude-plugins.sh          # from premium-webdev
bash scripts/bootstrap-claude-plugins.sh --check  # report only
```

Idempotent. Safe to run every session; it no-ops when everything is present.

---

## Skill routing — one driver per task

**Claude Code has no account-global CLAUDE.md.** Skills sync to the account;
routing rules do not. This section is why the starter exists: every project
created from it inherits the hierarchy. Canonical copy: `docs/ROUTING.md` in
premium-webdev.

These skills have overlapping descriptions and will all try to claim a design
request. **They are not peers.**

| Request | Driver |
|---|---|
| Build any new UI | **`frontend-design-skill`** (conductor — let it orchestrate) |
| Landing / marketing page | **`website`** |
| Rebuild an existing site from a URL | **`website-rebuild`** |
| Local business site | **`local-business-rebuild`** |
| Critique / polish / refine existing UI | **`/impeccable <verb>`** |
| Responsive behaviour | **`responsive-design`** |
| Theme creation | **`theme-factory`** |
| Design system generation | **`design-system-generator`** |
| Graphs / diagrams / data visualisation | **`graphify`** |
| Rendered video | **`remotion-motion-graphics`** |
| Substantial motion | **`premium-motion-direction`** decides what and why, then `gsap-*` |
| Complex engineering | **`feature-dev`** |
| Browser debugging | **Chrome DevTools** |
| Security | **`security-guidance`** (opt-in — see below) |
| Post-implementation cleanup | **`/simplify`** |

### Never drivers — reference only

`ui-ux-pro-max` · `design-libera` · `apple-design-hig` · `tailwind-ui-rules` ·
`high-end-visual-design` · `emil-design-eng` · `web-design-guidelines`

Look design data up rather than guessing it:

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/search.py" "<query>" --domain style
python3 "${CLAUDE_SKILL_DIR}/scripts/design_system.py" "<brief>" -p "Project"
```

88 styles · 192 palettes · 1,934 fonts · 74 typography pairings · 119 UX rules.

### Explicit invocation only

`visual-preview` · `full-output-enforcement` · `image-to-code` ·
`redesign-existing-projects` · `imagegen-frontend-web`

---

## Motion

| Need | Owner | Package (per-project) |
|---|---|---|
| Component entry/exit, hover, menus, micro-interactions | **Motion** | `motion` |
| Timelines, ScrollTrigger, scroll choreography, pinned sections, premium hero | **`gsap-core`** | `gsap` |
| Smooth scroll | **Lenis, only when justified** | `lenis` |
| Rendered video | **`remotion-motion-graphics`** | `remotion` |

Install only what the project actually uses. None ship in the starter.

**Every animation respects `prefers-reduced-motion`, and content is never gated
behind an animation.** `tests/visual.spec.ts` asserts the second point directly.

Lenis must not break native scrolling, anchor navigation, accessibility, mobile
performance, browser history, or deterministic testing.

---

## Quality gates

```bash
pnpm verify          # the gate: content → typecheck → lint → build → server
                     # → axe + responsive → Lighthouse → teardown
pnpm test:a11y       # WCAG 2.1 A/AA, keyboard, focus, alt, overflow, targets
pnpm test:visual     # visual regression vs baselines
pnpm lighthouse      # 3 samples, median and spread
```

`scripts/verify.mjs` owns one server and sets `VERIFY_OWNS_SERVER=1` so
Playwright reuses it instead of tearing it down before the Lighthouse pass.

Run `pnpm typecheck` after a first build — Next generates `next-env.d.ts` and
`.next/types` during `build`, so a cold clone can fail typecheck until it has
built once.

### Visual regression

```bash
pnpm test:visual:update   # first run only — generates baselines, review by eye
pnpm test:visual          # thereafter
```

Baselines are **per-project** and generated locally; none ship with the starter.
They are written per Playwright project, so one run covers mobile-390,
tablet-768 and desktop-1440.

`tests/helpers/stabilise.ts` makes screenshots deterministic: forces reduced
motion, zeroes CSS animation and transition durations, freezes `Date` and seeds
`Math.random`, waits for `document.fonts.ready`, scrolls to trigger lazy images
and waits for decode, pauses video, flushes the GSAP global timeline, stops
Lenis, and pauses marquees and autoplay.

**Never update baselines to turn a red test green without looking at the diff.**
That is why updating is a separate script and is not part of `pnpm verify`.

---

## Security tiers

`security-guidance` is installed but **disabled by default** — its `Stop` hook
runs an LLM diff review on every stop, which is spend for nothing on CSS work.

| Tier | Work | Action |
|---|---|---|
| 1 | Normal visual/CSS | leave disabled |
| 2 | Auth, APIs, forms, DB, uploads, payments, webhooks, secrets, env vars, user input | `claude plugin enable security-guidance@claude-code-plugins` |
| 3 | Pre-production | enable, then `/security-review` |

Disable again afterwards.

---

## Workflow

```
implement → test → visual QA → /simplify → test again
          → visual regression → security review
```

## SEO and indexing

Indexing is opt-in via `NEXT_PUBLIC_SITE_INDEXABLE=true`, set only on
production. Preview builds return `Disallow: /`, so a Lighthouse SEO score
around 66 on a preview URL is **correct**. Do not remove the guard to turn it
green.

## Keep out of the starter

No client content, selectors, imagery, metadata, testimonials, sections,
baselines or tests. No runtime packages a project may not need. Client-specific
material belongs in the client project only.
