# Websites

Premium client website work. Design skills live in `.claude/skills/` and load automatically.

## Layout

- `starters/premium-site/` — Next.js 16 + React 19 + TypeScript + Tailwind v4 starter.
  Copy it to `clients/<name>/` to begin a project; do not build directly in the starter.
- `.claude/skills/` — 36 vendored skills. Provenance and local edits in `CREDITS.md` there.
- `.claude/skills/00-design-references/` — shared data, not a skill. Read by `website-rebuild`.

## Conventions

- pnpm, not npm or yarn.
- App Router, `src/` directory, `@/*` import alias.
- Run `pnpm build` before declaring UI work finished — it typechecks and catches RSC errors.

## Working on design

Reach for the skills rather than improvising. In rough order of a project:

1. `shape` — structured discovery before any code.
2. `ui-ux-pro-max` search scripts — palette, type pairing and style selection when the
   client has no brand kit. Run the script; do not guess values from memory.
3. `impeccable` or `website` — the build.
4. `critique`, `audit`, `web-design-guidelines`, `tailwind-ui-rules` — review passes.
5. `visual-preview` — generate the client-facing HTML review artefact.

`frontend-design-skill` imposes an 8-item evidence gate before showing output. Honour it;
"I used best practices" is not evidence.

## Hard bans carried by these skills

No emoji as icons or decoration — SVG only. Not Inter + Roboto as the display/body pair.
No `slate-*` as a palette. No purple-to-blue gradients. No lorem ipsum or grey placeholders
in anything presented as finished. One heroic effect per screen.

## Environment notes

- Claude Code web sessions are ephemeral: only what is committed survives. Never install
  skills to `~/.claude/skills/` here — vendor them into `.claude/skills/` and commit.
- Playwright and Chromium are preinstalled system-wide (`/opt/pw-browsers`).
  Never run `playwright install`.
- `remotion-motion-graphics` needs `remotion @remotion/cli react react-dom` per project.
