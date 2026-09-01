@AGENTS.md

# Typography — APPROVED, do not change

Signed off by the client 2026-09-01. The large hero `B Boutique` wordmark is the
source of truth. Preserve it through every future homepage change.

Preserve: high-contrast luxury fashion serif character · tall elegant
proportions · the current thin/thick stroke contrast · editorial presence ·
the cream/ivory treatment on the red hero.

Do not make it heavier, more generic, more traditional, more condensed or more
decorative. Do not offer alternative wordmark typography again — that decision
is closed.

## The hierarchy — one face per role, never the serif everywhere

| Role | Face | Where it is set |
|---|---|---|
| B Boutique branding | Bodoni Moda, via `.display` | `Hero.tsx` h1 (adds `.chrome` for the ivory fill) and the `Nav.tsx` header wordmark — deliberately the *same* face at two sizes, so the identity reads as one thing |
| Large editorial statements | Bodoni Moda, via `.display` | `PointOfView.tsx`, section headings |
| Corner navigation | Archivo, `font-grotesk font-extrabold uppercase` | `CornerMenu.tsx` menu labels |
| Small labels / numbers / metadata | JetBrains Mono, and `.label` for tracked caps | index numbers, section eyebrows, the MENU/CLOSE chip |
| Body copy | Jost | everything else |

`.display` and `.label` live in `@layer base` in `globals.css` and must stay
there. Unlayered CSS beats Tailwind v4 utilities outright, so moving them out
silently overrides every per-element `leading-*` and `tracking-*` on the site.
