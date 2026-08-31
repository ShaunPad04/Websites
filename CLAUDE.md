# Websites

Premium client website work. Skills in `.claude/skills/` load automatically.

## Layout

- `starters/premium-site/` — Next.js 16 + React 19 + TypeScript + Tailwind v4 starter.
  Copy to `clients/<name>/` to begin a project. Do not build directly in the starter.
- `.claude/skills/` — 16 skills, one job each. Provenance in `CREDITS.md` there.
- `.claude/skills/00-design-references/` — shared data, not a skill. Read by `website-rebuild`.

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
| Change existing UI | `impeccable <verb>` | See below. |
| Motion graphics / video | `remotion-motion-graphics` | Unrelated to the web skills. No conflict. |

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

### Explicitly invoked only — never self-trigger

| Skill | When |
|---|---|
| `visual-preview` | You want a client-facing HTML review artefact. |
| `web-design-guidelines` | A review pass against Vercel's Web Interface Guidelines. |
| `design-system` | Building or extending a token architecture. |
| `brand` | Brand voice, messaging, identity rules. |
| `brandkit` | Generating brand-guideline boards and identity imagery. |
| `imagegen-frontend-web` | Generating per-section reference imagery before building. |

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
6. `visual-preview` — the client review artefact.

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
