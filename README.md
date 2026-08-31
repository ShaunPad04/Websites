# Websites

Web design and development environment for premium client work.

```
.claude/skills/          16 design skills, one job each
starters/premium-site/   Next.js starter — the base for new client projects
```

## Starting a client project

```bash
cp -r starters/premium-site clients/<client-name>
cd clients/<client-name> && pnpm install && pnpm dev
```

## Stack

| | |
|---|---|
| Next.js 16.3.4 · React 19.2.8 · TypeScript 5.9.3 | App Router, `src/`, `@/*` alias |
| Tailwind CSS 4.3.3 | |
| `motion` 13.1.1 | React animation |
| `gsap` 3.15.0 | Scroll-driven narrative. [Standard no-charge licence](https://gsap.com/standard-license) covers client sites; re-check if you ever sell a template |
| `lenis` 1.3.26 | Smooth scroll |
| Playwright 1.62.1 + axe-core 4.13.0 | Responsive + WCAG testing |
| Lighthouse 13.4.1 | Performance, SEO, best-practices scoring |

## Quality gates

```bash
pnpm typecheck     # tsc --noEmit
pnpm build         # typechecks + catches RSC errors
pnpm test:a11y     # WCAG 2.1 A/AA + keyboard nav, at mobile / tablet / desktop
pnpm audit:perf    # Lighthouse; fails below 90 perf / 100 a11y / 95 BP / 100 SEO
```

The baseline starter scores **100 / 100 / 100 / 100**. That is the number you put in front
of a client, and the floor you keep as the site grows. Add each new route to `ROUTES` in
`tests/accessibility.spec.ts`.

## The skills

16 skills load automatically in any Claude Code session on this repo. **They have
overlapping descriptions and will compete for a request unless routed** — the precedence
table lives in [`CLAUDE.md`](CLAUDE.md). Read it before invoking anything.

The short version:

- **`frontend-design-skill`** drives new UI. It is a conductor with an 8-item evidence gate.
- **`website`** drives landing pages. **`website-rebuild`** drives URL rebuilds.
- **`impeccable <verb>`** drives every change to existing UI — it owns 17 refinement modes
  (`polish`, `audit`, `critique`, `shape`, `bolder`, `quieter`, `animate`, `harden`…).
- **`ui-ux-pro-max`** is a data lookup, never a driver:
  ```bash
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "luxury architecture studio" --domain style
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "wellness spa" --design-system --project-name "Serenity"
  ```
- **Reference only:** `high-end-visual-design`, `emil-design-eng`, `apple-design-hig`,
  `tailwind-ui-rules`.
- **Invoked explicitly:** `visual-preview` (client review artefact), `web-design-guidelines`,
  `design-system`, `brand`, `brandkit`, `imagegen-frontend-web`.
- **`remotion-motion-graphics`** for video. Needs `pnpm add remotion @remotion/cli` per project.

Attribution, upstream commit SHAs, local modifications and everything deliberately excluded:
[`.claude/skills/CREDITS.md`](.claude/skills/CREDITS.md).

## Not installed

Deliberate omissions, each a one-liner away:

- **shadcn/ui** — `pnpm dlx shadcn@latest init`. Weigh it against the skills' bans on
  templated defaults; use it for Radix primitives, then restyle hard.
- **three.js / React Three Fiber** — add per project when a build actually needs WebGL.
- **CMS** (Sanity, Payload) — a per-client decision.
- **Chrome DevTools MCP** — overlaps Playwright; headless-only in web sessions.
