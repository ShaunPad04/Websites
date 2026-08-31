# Reference: build specifics

This is the **floor** of quality, not the ceiling. The chosen direction outranks any snippet in here.

## Typography

A display + body pair, both loaded explicitly. Neither Inter nor Roboto in that pair. If the project has a brand kit, the pair comes from there and this section only supplies the mechanics.

Loading mechanics — shown on a neutral pair (the actual pair is chosen for the direction, not copied from here):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

A high-contrast serif (Playfair and relatives) on a cream background is banned image #1 from SKILL.md. Don't reach for it as the "safe default".

What goes where: display — h1/h2 and one accent block; body — 16–18px, `leading-relaxed`, 60–75 characters per line; mono — numbers, labels, kickers, timers (`tabular-nums`).

Scale: no more than 5 steps, ratio ~1.25–1.333. Weight and size carry hierarchy — not underlines and not color.

## Icons — SVG only

Lucide (web): `<script src="https://unpkg.com/lucide@latest"></script>` + `lucide.createIcons()`, icons as `<i data-lucide="arrow-right"></i>`.
React: `lucide-react`. Native: `@expo/vector-icons` / SF Symbols / Material Symbols.

One set per project. Size in multiples of 4 (16/20/24). Same `stroke-width` everywhere. An icon button must have an `aria-label`.

## Images — the ladder, top to bottom

1. **Generate to the art direction** — only after an explicit yes and a stated price. Repeat the direction, palette and lighting in the prompt. One place, one image: if it came out wrong, fix the prompt and regenerate that same one, don't fan out variants.
2. **Hard curation** — a set where every frame looks shot for one project (one light, one temperature, one crop).
3. **Abstraction instead of photography** — gradient meshes, noise, patterns, typographic fields.
4. **Stock last**, and only with a justification in gate item 05. Never: "team at laptops", "handshake", "pensive person at a window".

Always: `loading="lazy"`, `width`/`height` against layout shift, meaningful `alt`, an overlay under text for contrast.

## Space and depth

Spacing on one scale (4/8/12/16/24/32/48/64/96). Sections get `py-20 md:py-32`, not `py-8`. Empty space is a material, not a leftover.

Depth: no more than two levels. Shadows soft and tinted (`shadow-[0_8px_30px_rgb(0,0,0,0.12)]`), not a black blur by default. Borders are `border-white/10` on dark, not `#ccc`. Use glass once per screen: `bg-white/5 backdrop-blur-xl border border-white/10`.

## Motion

Baseline — a transition on every interactive element:

```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

Hover: `hover:-translate-y-0.5 hover:shadow-lg` · Active: `active:translate-y-0 active:scale-[0.98]` · Focus: `focus-visible:ring-4 focus-visible:ring-[accent]/20 focus-visible:outline-none`.

Entrances are one orchestrated sequence with a 40–80ms stagger, not a fade-up on every block. Mandatory:

```css
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
```

## States

Every screen is designed in four: **loading** (a skeleton shaped like the content to come, not a spinner), **empty** (an invitation to act plus a button, not "no data"), **error** (what broke and how to fix it, no apologies), **success** (a toast whose verb matches the button: "Publish" → "Published").

```html
<div class="animate-pulse space-y-3" aria-busy="true">
  <div class="h-40 rounded-xl bg-white/5"></div>
  <div class="h-4 w-3/4 rounded bg-white/5"></div>
  <div class="h-4 w-1/2 rounded bg-white/5"></div>
</div>
```

## Mobile — a decision, not a squeeze

What gets solved differently on a phone: navigation (not a hamburger by default — consider a bottom bar), block order, the type scale gets recomputed, touch targets ≥ 44px, `env(safe-area-inset-bottom)`, a horizontal scroll-snap instead of a four-column grid, a sticky CTA at the bottom.

The check: open 375px and ask — was this designed for a phone, or flattened onto one? If it was flattened, gate item 07 is ❌.

## Browser verification — temp files stay out of the project

Playwright MCP writes screenshots and dumps into the **current directory**. One run drops `.playwright-mcp/` and loose PNGs into wherever you started.

So: both the verification HTML and the screenshots go into a scratch directory, with the path passed explicitly (`browser_take_screenshot` with a full path). Before you report, confirm the project folder has no leftover `.playwright-mcp/`, verification `*.png`, or a stray local HTTP server.

## Speed (item 08)

Fonts — `display=swap` + preconnect. Images — modern format, the size actually needed, lazy below the fold. No animation library for the sake of one fade. CSS instead of JS wherever CSS is enough. Target: interactive < 2s.
