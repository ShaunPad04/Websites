@AGENTS.md

# Typography — APPROVED, do not change

Signed off by the client 2026-09-01; the wordmark MOVED 2026-09-02.

The large `B Boutique` wordmark is no longer in the hero — the approved hero is
the photograph with small type placed on it, and nothing else. The giant
wordmark now lives once, at the very end of the page, in the footer. That
footer wordmark is the source of truth for this treatment. Do not reintroduce a
giant wordmark to the hero; it was removed deliberately.

Preserve: high-contrast luxury fashion serif character · tall elegant
proportions · the current thin/thick stroke contrast · editorial presence ·
the cream/ivory treatment on the red hero.

Do not make it heavier, more generic, more traditional, more condensed or more
decorative. Do not offer alternative wordmark typography again — that decision
is closed.

## The hierarchy — one face per role, never the serif everywhere

| Role | Face | Where it is set |
|---|---|---|
| B Boutique branding | Bodoni Moda, via `.display` | The giant wordmark in `Footer.tsx`, and the small one in the `Nav.tsx` header — deliberately the *same* face at two sizes, so the identity reads as one thing |
| Large editorial statements | Bodoni Moda, via `.display` | `PointOfView.tsx`, section headings |
| Corner navigation | Archivo → **now Inter**, `font-extrabold uppercase` | `CornerMenu.tsx` menu labels |
| Small labels / numbers / metadata | JetBrains Mono → **now Inter**, `.label` for tracked caps | index numbers, section eyebrows, header and hero micro-type |
| Body copy | Jost → **now Inter** | everything else |

**Updated 2026-09-02:** the three UI faces collapsed into one. Jost, Archivo and
JetBrains Mono are gone; Inter does all of it. Bodoni Moda is unchanged and
still carries every editorial moment. `font-sans`, `font-grotesk` and
`font-mono` all alias to Inter so old classNames keep working.

`.display` and `.label` live in `@layer base` in `globals.css` and must stay
there. Unlayered CSS beats Tailwind v4 utilities outright, so moving them out
silently overrides every per-element `leading-*` and `tracking-*` on the site.
