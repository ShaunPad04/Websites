# Websites

Web design and development environment for premium client work.

## Layout

```
.claude/skills/          36 vendored design skills + shared reference data
starters/premium-site/   Next.js starter, the base for new client projects
```

## Starting a client project

```bash
cp -r starters/premium-site clients/<client-name>
cd clients/<client-name>
pnpm install
pnpm dev
```

## Stack

| | Version |
|---|---|
| Next.js | 16.3.4 (App Router) |
| React | 19.2.8 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |
| ESLint | 9.39.5 (`eslint-config-next`) |
| Package manager | pnpm 10.33.0 |

## The skills

36 skills load automatically in any Claude Code session opened on this repo.
Full attribution, upstream commit SHAs and local modifications: [`.claude/skills/CREDITS.md`](.claude/skills/CREDITS.md).

**Direction and build**
`impeccable` · `website` · `frontend-design-skill` · `high-end-visual-design` · `emil-design-eng` · `design` · `image-to-code`

**Design intelligence (searchable data)**
`ui-ux-pro-max` — 84 styles, 192 palettes, 74 font pairings, 22 stack guides
`design-system` · `brand` · `ui-styling` (shadcn/Radix/Tailwind)

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "luxury architecture studio" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "wellness spa" --design-system --project-name "Serenity"
```

**Discovery and planning**
`shape` (structured client interview) · `brandkit`

**Iteration**
`layout` · `typeset` · `colorize` · `animate` · `polish` · `clarify` · `adapt` · `harden` · `optimize`

**Tone calibration**
`bolder` · `quieter` · `distill` · `delight` · `overdrive`

**Review and audit**
`critique` (UX scoring, persona testing) · `audit` (a11y/perf/responsive, P0–P3)
`web-design-guidelines` (audits against Vercel's Web Interface Guidelines)
`tailwind-ui-rules` (Tailwind correctness; writes `design-system.md` per project)
`apple-design-hig` (53 Apple HIG reference documents)

**Client review loop**
`visual-preview` — generates a self-contained HTML preview with light/dark side by side,
live design-token controls, and a DevTools-style element picker for comments. The client
clicks through it and exports markdown you paste straight back into Claude Code.

**Full rebuilds**
`website-rebuild` — 14-phase URL-to-rebuild pipeline, backed by `00-design-references/`
(DESIGN.md teardowns of Stripe, Apple, Linear, Vercel, Airbnb, Notion, Nike, Spotify, Shopify, Wise)

**Motion**
`remotion-motion-graphics` — code-based motion graphics with a mandatory
render → inspect frames → fix loop. Requires per project:
```bash
pnpm add remotion @remotion/cli react react-dom
```

## Not yet installed

Declined during setup, straightforward to add later:

- `shadcn/ui` — `pnpm dlx shadcn@latest init`
- Testing: `@playwright/test`, `@axe-core/playwright`, `lighthouse`
- Chrome DevTools MCP

Note: Playwright and Chromium are already present at the system level in Claude Code web
sessions (`/opt/pw-browsers`). Never run `playwright install` there.
