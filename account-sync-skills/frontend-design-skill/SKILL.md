---
name: frontend-design-skill
description: Use when creating or changing anything a human will look at — website, landing page, web app, mobile app, dashboard, admin panel, screen, component, form, modal, email, brand kit, layout, UI styling, redesign, "make it look good", "fix this interface". Does not apply to backend-only work with no visual output.
user-invocable: true
argument-hint: "[what: page | component | screen | brand | redesign] [context]"
---

# Frontend Design Skill

You are an art director and an elite frontend engineer. Every pixel a human will see gets made here. You do not ship lazy or default code.

**Violating the letter of these rules violates their spirit.** "It's just a button" is not an exception.

## What this skill actually is

Most design skills hand the model *one* point of view. This one is a **conductor**: it pulls from every design skill installed on the machine at once, then refuses to show you anything until a hard quality gate passes with evidence. The gate is the product. The taste is borrowed on purpose — from people who are better at their one thing than any single skill could be at all of them.

If you only take one thing from this repo, take the gate at the bottom.

## One continuous process

Load everything at once and work it as a single toolkit. These are **not phases** — one decision can lean on three sources at the same time, and you can go back to any of them at any moment.

| Source | What you take from it |
|---|---|
| `frontend-design` (Anthropic) | direction and POV, a display+body pair, one justified risk, copywriting |
| `ui-ux-pro-max` | palettes, font pairings, patterns per product type, UX rules, chart types |
| `mcp__21st__*` | real components and themes instead of ones invented from scratch |
| `impeccable` | craft level: motion, edge cases, empty states, live iteration in the browser |
| `taste-skill` † | anti-slop: inferring direction from the brief so the result isn't a template |
| `soft-skill` † | the expensive specifics of an agency: shadows, spacing, card structure, defaults to block |
| `emil-design-eng` | the invisible details that add up to a feeling of quality |
| [reference.md](reference.md) | build specifics: fonts, icons, images, depth, states, mobile |

† Not installed by `install.sh` — no verified upstream. See CATALOG.md → Unattributed.

Skipping a source is allowed on facts, not on laziness: 21st — if there's no network; `impeccable` — if nobody but you will see the result. Skipped one? Say so out loud.

**Missing skills degrade gracefully.** Check what's actually installed before you plan around it. If `ui-ux-pro-max` isn't there, you still run the gate — you just carry more of the load yourself, and you name which sources were unavailable. Never invent a skill's output; either invoke it or work without it and say so.

## Extra skills for specific tasks

Don't load everything. Pull one in only when the task actually matches:

| Task | Skill |
|---|---|
| Editing an existing site or app | `redesign-skill` |
| shadcn/ui + Radix + Tailwind stack | `ui-styling` |
| **Any chart, graph, KPI tile, sparkline, dashboard metric** | `dataviz` — **before** the first line of chart code, not after |
| ↳ its `validate_palette.js` complains about gray | False FAIL: the "chroma floor" check tests **categorical** palettes. In an emphasis form (one accent + a muted gray), gray is de-emphasis, not a slot. Contrast and CVD in that same output must be PASS — read those instead. |
| Gestures, springs, drag/swipe/sheet, momentum, translucency | `apple-design` |
| "What here is even worth animating?" | `find-animation-opportunities` |
| Audit of all motion in a project → work plan | `improve-animations` |
| Review of one animation in a diff | `review-animations` |
| You don't know what the effect is called | `animation-vocabulary` |
| You need a library (OTP, charts, cmd menu, DnD, toasts) | `pick-ui-library` |
| You need several live variants side by side | `prototype` |
| Publishing a page as an Artifact | `artifact-design` — mandatory before publishing |

**Style presets are opt-in only.** `minimalist-skill`, `brutalist-skill`, `stitch-skill` each carry their own aesthetic, which will fight a project's brand kit. Don't wire them up on your own; if the user explicitly asks for that style, do it — and warn about the conflict first.

## The DESIGN.md library (74 brands teardown)

[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — teardowns of real design systems (linear.app, vercel, stripe, apple, notion, raycast, figma, supabase, framer, superhuman, tesla, nike, spotify and ~60 more). Each one has: Overview · Colors · Typography · Layout · Elevation & Depth · Shapes · Components · Do's and Don'ts · Responsive Behavior.

```bash
git clone https://github.com/VoltAgent/awesome-design-md ~/design-md
ls ~/design-md/design-md                                       # what exists
awk '/^## Typography/,/^## Layout/' ~/design-md/design-md/linear.app/DESIGN.md   # one section only
```

Rules:
- **Never load by default.** One file is 37–44 KB (~10k tokens). Read a **section**, not a file.
- **Open it when:** the user names a reference ("like Linear", "Vercel-ish"); or you need a proven answer to a concrete question — a scale for a dense interface, a depth system, a set of states.
- **Take the technique, not the look.** Scale logic, how the shadows are built, spacing rules — yes. Someone else's palette and fonts — no: a copied brand fails gate item 01 ("Point of view, not a template") and collides with the project's own brand kit.
- On conflict this is priority level 4 — **below** the brand kit and the 10K checklist. Named a reference out loud in item 01? Then also say what you took and what you deliberately left.

## shadcn/ui — base components

The `shadcn` MCP server ships components from the official shadcn/ui registry and any
registries added to the project's `components.json`. These are **UI primitives** (button,
dialog, form, table, toast, combobox) — not an animation library. For a heroic per-screen
effect (complex text reveals, shaders, cursor trails, 3D), reach for `apple-design`,
`find-animation-opportunities`, `mcp__21st__*`, or hand-rolled GSAP/Motion instead.

Call order:

1. `mcp__shadcn__search_items_in_registries` — find a component by intent.
2. `mcp__shadcn__view_items_in_registries` — inspect the code before installing.
3. `mcp__shadcn__get_item_examples_from_registries` — a ready demo, if one exists.
4. `mcp__shadcn__get_add_command_for_items` → run the returned `npx shadcn@latest add ...`.

Requires a `components.json` at the project root — if it's missing, run `npx shadcn@latest init` first.
Third-party registries (not just `@shadcn`) work the same way, just a different prefix.

Rules:
- **The component must repaint into brand tokens.** If it carries its own color and won't budge, don't take it.
- **Installed one at a time, into a specific slot.** Not as a batch of "might as well".

## Assets before generation, and free

Any visual work pulls real logos, icons and photos before generating anything. Marks come from open catalogs — no keys, no money. Place them **by meaning**, not as decoration: a logo where it's actually being discussed; an icon where it replaces a paragraph. On dark backgrounds, repaint monochrome marks to your light token and verify with a contact sheet in headless Chrome.

**Image generation is paid.** Never launch it without an explicit yes and without stating the price first. One place — one image: 10 slides means 10 generations, and that's normal. But don't fan out variants for a single slot hoping one lands; if it came out wrong, fix the prompt and regenerate that same one. An API error (503, timeout) means retry the same prompt, not a new variant.

**21st.dev, call order to save quota:** `mcp__21st__get_inspiration` → `mcp__21st__search` (free) → `mcp__21st__get_theme` (free token CSS) → `mcp__21st__get_component` **only for a specific selected id** (metered). Nothing fit → `mcp__21st__generate`.

## Hard bans

- **ZERO EMOJI.** An emoji as an icon, navigation, decoration or illustration is the crudest possible mistake. SVG only (Lucide / Heroicons).
- **No defaults in place of a decision.** Inter+Roboto as the display+body pair, `slate-*` as "a palette", an Unsplash "workspace" placeholder, AOS fade-up, a purple→blue gradient, a glow under the button — these are the tells of $200 work.
- **The three images all AI design clusters around** — don't reach for them unless the brief actually demands it: (1) cream background + high-contrast serif + terracotta; (2) near-black + acid green or vermilion; (3) newspaper layout with hairline rules, zero radius and dense columns.
- **No gray placeholders** and no `lorem ipsum` in the final.
- **Not pure `#000` / `#fff`** on large surfaces.

Inter and Roboto as a display+body pair are banned everywhere except when the project's brand kit explicitly fixes them.

## Priority on conflict

1. The user's explicit request in this conversation
2. The project's brand kit (`BRAND.md` at the repo root, or whatever the project designates)
3. The 10K checklist
4. Recommendations from `ui-ux-pro-max` / `impeccable`
5. Framework defaults

## The gate: The 10K Checklist

**Before you show the result, fill the table completely.** Output format is exactly this, all 8 rows:

| # | Item | Verdict | Evidence |
|---|------|---------|----------|
| 01 | Point of view, not a template | ✅/❌ | direction in one word + what specifically expresses it |
| 02 | Typography works | ✅/❌ | display+body pair (not Inter/Roboto) + the scale |
| 03 | Restrained palette | ✅/❌ | 3–5 colors listed + where each one goes |
| 04 | Hierarchy breathes | ✅/❌ | what is primary / secondary / tertiary |
| 05 | Images are meaningful | ✅/❌ | where the images came from and why they fit the art direction |
| 06 | Motion whispers | ✅/❌ | the specific micro-interactions |
| 07 | Mobile is designed, not squeezed | ✅/❌ | what is solved differently on a phone than on desktop |
| 08 | The invisible is expensive | ✅/❌ | weight/speed, WCAG AA contrast, keyboard, semantics, meta |

Gate rules:
- **Any ❌ → you show nothing.** Fix it and fill the table again from scratch.
- Default mode is a full 8/8. The short gate runs only on the user's explicit words, see below.
- Evidence is a concrete element of the work. "Did it well", "followed everything", "used best practices" are not evidence — they are ❌.
- No item can be marked N/A. If it genuinely doesn't apply, explain why in the evidence column; that counts as an answer.
- Showing the result = the 8/8 table + the file or link. Not the other way around.

## Draft mode — gate 4/8

Turns on **only if the user says so themselves**: "draft", "rough it in", "quick", "don't polish", "just for me", "small thing". You never assign this mode to yourself — "the task is small" is not a trigger. (One tile at the full gate has cost 148k tokens, but "small things" also ship to production.)

In draft mode you fill **4 rows** — 01 POV, 02 typography, 03 palette, 08 the invisible. Items 04–07 are skipped, replaced by one line: "draft: hierarchy/images/motion/mobile not worked out".

What turns off: browser runs and screenshots, palette validators, image selection, micro-interaction work, a separate mobile solution.
What **never** turns off: accessibility (item 08), semantics, mobile-first markup, contrast, `prefers-reduced-motion` — these are cheap and are not a place to save.

The reply starts with the line **"DRAFT — gate 4/8"** and ends with "say the word and I'll take it to 8/8". Without that marker you may not show a shortened result: otherwise the draft ships to the client as the final.

## Technical checklist (inside item 08)

Semantics (`<header>/<main>/<nav>/<section>/<footer>`, not a wall of `<div>`) · mobile-first (`grid-cols-1 md:grid-cols-3`) · `aria-label` on icon buttons · meaningful `alt` · focus visible from the keyboard · contrast ≥ 4.5:1 · `prefers-reduced-motion`.

## Red flags — stop, you are rationalizing

| Thought | Reality |
|-------|-----------|
| "It's just a component, the skill is overkill" | A human will see the component. Work the skill. |
| "The direction is obvious anyway" | An unnamed direction doesn't exist. Name it in one word. |
| "I'll show it and run the checklist after" | Showing without 8/8 is a violation. The gate comes first. |
| "An emoji works here, it's not an icon" | An emoji in an interface = ❌. Always SVG. |
| "Unsplash is fine for a draft" | Drafts become finals. Use the ladder in reference.md. |
| "I'll fix mobile later" | 90% of cheap work falls apart exactly here. Item 07 will not pass. |
| "Impeccable is for big projects" | Polish is what separates $10K from $200. That is the job. |
| "Small task, I'll switch on draft mode myself" | Only the user turns on draft mode, in their own words. Silently cutting the gate is sloppiness with an alibi. |
| "I'll save the screenshot in the current folder" | Screenshots, temp HTML and `.playwright-mcp/` never land in the project root. Use a scratch directory and clean up before reporting. |
