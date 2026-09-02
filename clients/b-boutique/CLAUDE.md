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

---

# Locked decisions — 2026-09-02

Signed off by the client. **Do not revisit any of these unless they explicitly
ask.** Each one is here because it was already argued out once; re-opening it
costs a review cycle and risks undoing a deliberate fix.

| # | Decision | Why it is not a bug |
|---|---|---|
| 1 | **Bodoni Moda + Inter.** | The reference board's Playfair Display + Montserrat annotation is not the source of truth. The prompt and the approved visual are. |
| 2 | **The hero philosophy copy wraps naturally.** | It falls in 3 lines at 264px where the mockup showed 4. The words are exact; hard-coded breaks shift with the font and viewport. Responsive wrapping beats brittle `<br>`. |
| 3 | **SEARCH and BAG (0) are inert `<span>`s.** | Visually part of the approved header, but there is no search index and no cart. Nothing to click, nothing to tab to, `aria-hidden` so AT does not announce a dead control. Swap in an `<a>`/`<button>` and drop the aria-hidden the day either becomes real. Never fake cart state, checkout or a search backend. |
| 4 | **`LocalTime.tsx` stays.** | Unused since the header lost the Cleethorpes clock. Unrelated code is not deleted as a side effect of other work. |
| 5 | **The mobile hero category placement stays.** | At 390 the labels used to sit across the hand and the ring. They are in the lower-left stack so eye, face, hand and jewellery all stay clear. Do not move them back to the vertical middle on small screens. |
| 6 | **The focus ring is `currentColor`.** | A fixed token cannot work: the ring runs over a black header, a photograph, a cool-white FAQ and a black footer. `var(--gold)` went black-on-black over the hero the moment gold was retired. Focusable text already contrasts with its own background, so borrowing its colour inherits that. Do not introduce a special focus colour. |
| 7 | **Hero parallax: ~32px desktop, ~11px mobile.** | Same travel eats far more of a taller crop seen through a shorter window, hence the two figures. |
| 9 | **The address is confirmed: 18 Sea View Street, Cleethorpes, DN35 8EZ.** | Client-confirmed 2026-09-02. The original brief said DN35 8HY; that is wrong and must never return. Neither may "6 Market Street", which belongs to a different project. Every address on the site derives from `shop.ts` — change it there or nowhere. The **parking claim** in the FAQ and Visit ("on-street parking at the top, Market Place car park a two-minute walk") is a separate, still-UNVERIFIED claim — do not treat this confirmation as covering it. |
| 8 | **No hero scale, no hero pinning.** | The 140vh sticky track is gone: it moved nothing for 40vh and put a blank spacer before the brand rail. The hero is exactly 100svh and the rail begins at its bottom edge. |

## Authority order when instructions conflict

1. What the client says in chat
2. An approved implementation prompt
3. The approved visual reference
4. Text annotations inside old reference boards
5. The existing legacy implementation

Legacy colours, fonts and placeholder design never override the approved
redesign.
