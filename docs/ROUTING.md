# Driver routing — one owner per task

These skills have overlapping descriptions and will all try to claim a design
request. **They are not peers.** One skill drives; the rest are reference or
explicitly invoked.

A duplicate-driver scan of the canonical set found **nine** skills whose
descriptions auto-claim ordinary design work. This file is what keeps them from
fighting.

---

## Persistence limitation — read this first

**Claude Code has no account-global `CLAUDE.md`.** Skills sync to the account;
routing rules do not. There is no supported mechanism that makes a routing file
apply to every project automatically.

So routing lives in two places, and both are needed:

1. **This file** — canonical, in `premium-webdev`, the source of truth.
2. **`starters/premium-site/CLAUDE.md`** — copied into every new client project,
   so each project inherits the rules at creation.

If you start a project *without* the starter, it has no routing rules until you
copy them in. That is a real limitation, not an oversight.

---

## One driver per request

| The request | Driver | Everything else |
|---|---|---|
| Build any new UI | **`frontend-design-skill`** | A *conductor* — it calls the others and holds an 8-item evidence gate. Let it orchestrate. |
| Landing / marketing page | **`website`** | Narrative structure, hero thesis, conversion arc |
| Rebuild an existing site from a URL | **`website-rebuild`** | 14-phase pipeline, owns the job end to end |
| Local business site | **`local-business-rebuild`** | Sector-specific pipeline |
| Change / critique / polish existing UI | **`impeccable <verb>`** (plugin) | 23 commands; owns all refinement |
| Responsive behaviour | **`responsive-design`** | |
| Theme creation | **`theme-factory`** | |
| Design system generation | **`design-system-generator`** | |
| Graphs, diagrams, data visualisation | **`graphify`** | Specialist driver — see below |
| Rendered video / motion assets | **`remotion-motion-graphics`** | Unrelated to web skills, no conflict |
| Substantial website motion | **`premium-motion-direction`** | Decides *what* moves and *why*, then `gsap-*` implements |
| Complex engineering | **`feature-dev`** (plugin) | Auth, booking, CMS, ecommerce, APIs, dashboards, portals, complex forms |
| Browser debugging / inspection | **Chrome DevTools** (plugin) | Not a design driver |
| Automated testing | **Playwright** | Starter infrastructure |
| Accessibility | **Axe / Playwright** | |
| Performance & SEO QA | **Lighthouse** | |
| Security | **`security-guidance`** (plugin, opt-in) | See `docs/PLUGINS.md` tiers |
| Post-implementation cleanup | **`/simplify`** | Built-in; no plugin needed |
| Complete no-placeholder delivery | **`full-output-enforcement`** | Explicit invocation only |

### Impeccable owns all refinement verbs

`adapt` `animate` `audit` `bolder` `clarify` `colorize` `critique` `delight`
`distill` `harden` `layout` `optimize` `overdrive` `polish` `quieter` `shape`
`typeset`

Invoke as `/impeccable polish`, `/impeccable audit`, `/impeccable critique`.
Upstream consolidated these so they stop competing with their own parent — do
not reinstall them as standalone skills.

### Graphify — specialist, not a general driver

Owns graph, diagram and data-visualisation work. It must **not** claim ordinary
website design: for a page that happens to contain a chart,
`frontend-design-skill` drives and Graphify handles the chart.

---

## Never drivers — reference only

Read for knowledge. They inform the driver; they must not take over.

| Skill | Consulted for |
|---|---|
| **`ui-ux-pro-max`** | **Data lookup, via its scripts.** 88 styles, 192 palettes, 1,934 fonts, 74 typography pairings, 17 motion presets, 119 UX guidelines, 22 stacks. Run the script — never guess these values from memory. |
| **`design-libera`** | LIBERA methodology: Build / Audit / Redesign / Study modes, 10 Vibe Archetypes, refusal clauses, G/B/P/H gate IDs, OKLCH strategy, LIBERA Fingerprint Test, macrostructure and brand-register methodology. Equivalent UI/UX *data* needs go to `ui-ux-pro-max`, not here. |
| **`apple-design-hig`** | Apple Human Interface Guidelines, platform conventions |
| **`tailwind-ui-rules`** | Tailwind implementation guidance |
| **`high-end-visual-design`** | What makes a site read as expensive; the defaults that read as cheap |
| **`emil-design-eng`** | Component craft and invisible details |
| **`web-design-guidelines`** | General guidance |

Run Pro Max data lookups as:
```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/search.py" "<query>" --domain style
python3 "${CLAUDE_SKILL_DIR}/scripts/design_system.py" "<brief>" -p "Project"
```

---

## Explicit invocation only

Carry `disable-model-invocation: true`. They never fire automatically.

| Skill | Invoke when you want |
|---|---|
| `visual-preview` | A rendered preview of the design |
| `full-output-enforcement` | Complete files, no placeholders, no `...rest unchanged` |
| `image-to-code` | Design image generated first, then implemented |
| `redesign-existing-projects` | A structured redesign pass |
| `imagegen-frontend-web` | Generated design reference imagery |

They stay out of the way during normal incremental work by design.

---

## Motion routing

| Need | Owner | Runtime package |
|---|---|---|
| Component entry/exit, hover, menus, micro-interactions, small layout transitions | **Motion** | `motion` — per-project |
| Complex timelines, ScrollTrigger, scroll choreography, pinned sections, layered reveals, premium hero motion, complex SVG | **`gsap-core`** + companions | `gsap` — per-project |
| Smooth scroll | **Lenis, only when justified** | `lenis` — per-project |
| Rendered video / motion assets | **`remotion-motion-graphics`** | `remotion`, `@remotion/cli` — per-project |

`premium-motion-direction` decides **what** should move, **why**, and how
restrained it should be — before any of the above implements it.

Do not reach for GSAP because it exists. Motion is simpler and more appropriate
for ordinary UI. Lenis must never break native scrolling, anchor navigation,
accessibility, mobile performance, browser history, or deterministic testing.

**Every animation must respect `prefers-reduced-motion`, and content is never
gated behind an animation.** The starter's visual suite asserts this.

---

## Runtime packages stay per-project

Global knowledge, per-project dependencies. Never force these into a project
that does not need them:

`gsap` · `motion` · `lenis` · `remotion` · `@remotion/cli` · `shadcn/ui` ·
Stripe · Supabase · any ORM · CMS · auth provider · email provider · SMS
provider · CRM · analytics · consent manager · search service · Sentry

`shadcn/ui` suits SaaS, dashboards and admin interfaces. For bespoke luxury
marketing sites, prefer custom components and custom visual direction.
