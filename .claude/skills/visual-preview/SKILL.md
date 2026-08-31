---
name: visual-preview
description: Generates an interactive HTML preview of the user's actual project UI with adjustable design-token knobs, DevTools-style element annotation, in-place text edit, and one-click markdown export back to Claude. Use when the user types "/visual-preview <topic>", asks for a UI mockup or design review of an existing app / route / component, or wants round-trip in-browser feedback on their codebase. Do not use for prose deliverables (API docs, type drafts, PR descriptions). CRITICAL: template.html is a behavior scaffold (comment picker, decision controls, direct-edit plumbing, export logic). Its sample preview UI AND its sample knob set (Surface/Accents/Typography/Radius/Density) are illustrative — never clone either of them. Both the preview UI and the set of adjustable knobs come from the user's real project (routes, components, design tokens, screenshots), not from the template. Default output: ./.visual-preview/<topic>/<YYYY-MM-DD>-<slug>.html
---

# visual-preview skill

## How this skill is meant to be used — READ FIRST

`template.html` is a **behavior scaffold**, not a **UI design source**.

What `template.html` provides — lift verbatim or near-verbatim:

- CSS for: app shell, controls rail, decision controls, comment overlays, picker, popover, side panel, direct-edit visual cues, export modal, toast
- JS modules for: decision system, comment picker, marker rendering, popover handling, direct-edit plumbing (`data-fd-editable`), export markdown assembly
- HTML skeleton: app shell, controls rail container, preview-pair container, modal overlays, markers layer
- The `data-fd-id` / `data-fd-editable` conventions, scope semantics, export markdown format

What `template.html` does NOT provide and you MUST NOT clone into the generated preview:

- The sample dashboard cards, workbench header, inspector rows, form components, status palette, type samples, or any other visual content inside `.preview-pair`
- The `TOKEN_GROUPS` structure and values — neither the categories (Surface / Accents / Typography / Radius / Density) nor the specific knobs / value ranges. The set of adjustable knobs in your generated preview must reflect the user's project's **actual tunable design dimensions** (what their `styles.css` / `tailwind.config` / theme files actually expose), not the template's example list.
- The `data-fd-id` names (those refer to the template's sample UI; yours must reflect YOUR design)

**If your generated preview's visual design comes from `template.html` rather than from the user's actual project, the output is invalid and must be regenerated.**

---

## When to invoke

- User types `/visual-preview <topic>`
- User asks for a UI mockup, design review, or visual decision HTML for their existing app
- User wants to round-trip per-element feedback for their codebase
- User pastes a `Frontend design round-trip` export and asks Claude to apply it

Do not invoke for prose-only deliverables (API contracts, dev log entries, type drafts, PR descriptions).

---

## Workflow (mandatory order — do NOT skip Step 1)

### Step 1 — Understand the user's project BEFORE reading the template

Before opening `template.html`, gather context about the user's actual project:

- **Routes / pages**: which URL or file path is the design about?
- **Components**: read the relevant TSX / Vue / Svelte / HTML files for the target screen
- **Design tokens**: read `styles.css`, `tailwind.config`, theme files, or wherever the project defines colors, typography, spacing, radius, shadows
- **i18n**: read locale files if the project is internationalized
- **Live preview**: if a dev server URL is available, describe what's rendered there
- **Recent design work**: skim `docs/`, `design/`, or any design docs for direction
- **Screenshots / mockups**: read any reference images the user provides

Determine the working mode:

- **Existing-app mode** (default): user references real components, routes, screenshots, or implementation phase. Your generated preview MUST match the live route in navigation frame, IA, density, typography scale, color tokens, and component hierarchy. A standalone preview that has no visual or structural relationship to the app is an invalid use of this skill.
- **Greenfield mode**: only when there is no UI yet AND the user explicitly asks for a fresh design from scratch. Even here, design from the user's stated intent (brand, domain, design tokens, references), NOT from the template's sample.

### Step 2 — Design the UI based on Step 1 context (BEFORE touching the template)

Design the UI now, before opening `template.html`. Reading the template first will anchor you to its sample dashboard layout.

Design principles:

- Match the user's project's navigation frame, IA, layout density
- Use the user's actual design tokens (colors, fonts, spacing) — read them, do not invent
- Use real terminology from the user's domain (route names, backend object names, copy from i18n files)
- Pattern decisions (cards / lists / tables / forms) should mirror what the user's project actually uses
- The template's "workbench / 4-card dashboard / inspector / status palette" pattern is ONE possible layout. If the user's app is a Twitter clone, your preview should look like Twitter. If it's a CRM, like a CRM. The template's shape is illustrative, not normative.

### Step 3 — Read `template.html` and extract ONLY the scaffolding

Now read `template.html`. Read it for the scaffolding only.

Lift verbatim into your generated file:

- All `<style>` blocks for: app shell, controls rail, decision controls (dropdown / slider / segmented / toggle), comment system (markers layer, picker overlay, picker hint, popover, comment list panel), export modal, toast
- All `<script>` content (decision system, comment picker, marker rendering, popover, export logic)
- The HTML skeleton: `<header class="app-header">`, `<aside class="controls">`, `.markers-layer`, `.picker-overlay`, `.comment-popover`, `.comment-list-panel`, `.export-modal`, `.toast`

Do NOT lift:

- The HTML inside `<div class="preview theme-light">` and `<div class="preview theme-dark">` (the template's sample UI)
- The `TOKENS` JavaScript object (you write a new one matching YOUR design's decisions)
- Sample-only CSS classes (`.wb-header`, `.node`, `.inspector`, `.form-sample`, `.status-grid` etc.) unless your designed UI actually uses those exact patterns

### Step 4 — Assemble the new preview

- Place your Step 2 design inside both `<div class="preview theme-light">` and `<div class="preview theme-dark">` containers (mirror them)
- **Design the knob set from the user's project, not the template.** Inspect the project's `styles.css` / `tailwind.config` / theme files and identify what is genuinely tunable (which CSS variables exist, which numeric properties recur across components). Build `TOKENS` and `SECTION_ORDER` to expose exactly those dimensions. The template's Surface/Accents/Typography/Radius/Density categories are one possible shape — they are NOT a required structure. If the project has a custom shadow scale, include a shadow knob. If the project doesn't have an opacity scale, do not invent an opacity slider just because it would feel symmetric. The knob set IS part of the design; design it for this project.
- Use the user's project's design-token NAMES (e.g., `--surface-page` if that's what the project uses, `--brand-primary` if that's what they use). Do not invent token names that the project doesn't already have.
- Update `PREVIEW_META.source`, `PREVIEW_META.topic`, `PREVIEW_META.targetFile` to point at the user's real source files
- Replace title, subtitle, and help banner copy

### Step 5 — Decorate every meaningful element with `data-fd-id` (and optionally `data-fd-editable`)

Add `data-fd-id="<kebab-name>"` to every meaningful element in YOUR designed UI. IDs reflect YOUR design's anatomy — do not reuse the template's anchor names.

Both light and dark mirrors share the same `data-fd-id`.

For text and form values the user should be able to **directly edit in the browser** (titles, copy, button labels, input default values, etc.), additionally add:

- `data-fd-editable="text"` — for visible text nodes (headings, paragraphs, labels). The element becomes `contenteditable` in the preview; edits sync across light/dark mirrors and appear in the export's `### Direct edits` section.
- `data-fd-editable="value"` — for `<input>`, `<textarea>`, `<select>`. The current value becomes part of the export.

Use direct edits for **copy / labels / option values / small visible text changes** — things that, in your real source, live in i18n locale files, component props, or fixture data. They are NOT a substitute for element comments; comments express "design intent on this element", direct edits express "I want this exact text/value committed".

### Step 6 — Write and verify

Write the file. Default path: `./.visual-preview/<topic>/<YYYY-MM-DD>-<slug>.html` (the user can override).

Self-check before reporting done:

- Self-contained: no `<script src=>`, no `<link>` to external CSS, no remote font / image fetch
- Opens via `file://`
- Light + dark previews side by side
- **The preview UI matches the user's actual project (NOT the template's sample)** — if uncertain, open the real route side-by-side and compare; regenerate if visually disconnected
- All decision controls update live; Comment Mode picker works on YOUR `data-fd-id` elements

### Step 7 — Report

Tell the user:

- Whether this was existing-app mode or greenfield mode
- What real files / routes / components it corresponds to
- The file path
- How to: open in browser → adjust tokens / Comment Mode → click any element to annotate → Export → paste markdown back to Claude

---

## Anti-patterns — regenerate if any of these apply

- ❌ Cloning template's sample UI (workbench header / 4 dashboard cards / inspector / form sample / status palette / type sample) into the generated preview when the user's project doesn't have those elements
- ❌ Substituting only text inside the template's sample components and leaving the visual structure unchanged ("text-substitution agent" behavior)
- ❌ **Cloning the template's `TOKEN_GROUPS` categories (Surface / Accents / Typography / Radius / Density) verbatim** instead of designing knobs that reflect the user's project's actual tunable design dimensions
- ❌ Using `data-fd-id="node-activity"` / `wb-header` / template-specific anchor names when your design doesn't have those concepts
- ❌ Hardcoding template's hex colors (`#2563eb`, `#f59e0b`, etc.) when the user's project defines its own design tokens
- ❌ Skipping Step 1 ("understand project context") and going straight to template manipulation
- ❌ Generating a preview that, opened side-by-side with the user's real app, looks like a different product

---

## Element ID convention

Every meaningful UI anchor in YOUR designed UI gets `data-fd-id="<kebab-name>"`. The following are NAMING PATTERNS, not values to copy verbatim:

| Element kind | Naming pattern |
|---|---|
| Page section | `section-<slug>` |
| Card | `card-<slug>` |
| List row | `row-<slug>` |
| Form field | `field-<name>` |
| Status pill | `pill-<state>` |
| Button | `btn-<purpose>` |
| Text block | `text-<role>` |

Light + dark mirrors share the same `data-fd-id` — comments are conceptual references to the UI element, not theme-specific references.

---

## Decision controls — pick the right type

| Control type | Use when | Example |
|---|---|---|
| **Dropdown** (visual options A/B/C with swatches/samples) | Discrete curated alternatives | Color palette, font family, layout pattern |
| **Slider** (continuous numeric range with live value chip) | Continuous numeric values | Font size, radius, padding, opacity |
| **Segmented** (compact 2-3 option toggle) | Tight A/B or A/B/C choices | Density, weight, alignment |
| **Toggle** (boolean) | On/off states relevant to review | Show grid, show comment markers, RTL preview |

Behaviors:

- Dropdown: hover-to-preview applies temporarily, click commits
- Slider: every input event commits
- Segmented & toggle: click commits

---

## Comment Mode UX (DevTools-style picker — use as-is from template)

Three states:

- **Default**: pristine preview; real UI hover states work; no comment indicators
- **Show Markers ON**: numbered badges visible on commented elements (without entering picker mode)
- **Comment Mode ON**: hover any element to highlight (translucent blue overlay + "+" badge); selector hint chip follows cursor; click to attach a comment

Popover:

- Free-text textarea (autofocus)
- 4 scopes: `this` / `all-matching` / `all-like-this` / `global`
- ↑ Parent / ↓ Child links re-target before save
- Re-clicking an already-commented element opens the existing comment (no duplicates)

Markers render in a top-level fixed-position layer so they're never clipped by ancestor `overflow: hidden`. They auto-attach to both light and dark mirrors via DOM-index pairing.

---

## Pane expand / collapse

Each preview pane has a toggle button in its outer top corner: `▶` in the light pane's top-right, `◀` in the dark pane's top-left.

- Click the light pane's `▶` → light expands to full width, dark collapses to a 36 px right strip whose only visible element is its `◀` button.
- Click the dark pane's `◀` → dark expands to full width, light collapses to a 36 px left strip whose only visible element is its `▶` button.
- Click the collapsed strip's arrow → restore the split view.

The collapse is **display only**. Decision knobs continue to apply CSS variables to both `theme-light` and `theme-dark` panes simultaneously regardless of which one is visible — when the user expands the collapsed pane again, every adjustment made in the meantime is already there. Direct edits and comment markers behave the same way.

---

## Direct edits UX

Elements decorated with `data-fd-editable` get a subtle visual cue (1px dashed outline on hover, 2px solid outline + tinted background on focus, using `--accent-primary`) so the user knows they're editable.

- `data-fd-editable="text"` → element is rendered with `contenteditable="plaintext-only"`; click and type to edit. Multi-line is allowed; the export preserves line breaks via hanging-indent.
- `data-fd-editable="value"` → standard form-control behavior; the current `.value` is captured on `input` / `change`.

Edits sync across the light and dark mirrors (both share `data-fd-id`). Reset reverts every edited element to its initial value. Direct edits are tracked completely separately from token decisions and element comments — a single Export call can include any combination of the three.

If the user is in Comment Mode and clicks an editable element, the comment picker takes priority (so they can still comment on editable elements). The direct-edit hover cue is suppressed while Comment Mode is on.

---

## Export — single button, organized assembly

One Export button assembles one fenced markdown block:

1. Top metadata (source path, capture timestamp, skill name, topic)
2. Decisions section (token decisions grouped by category, with rejected options noted)
3. Direct edits section (each `data-fd-editable` whose value changed, with element / kind / value)
4. Element comments section (per-comment: selector + scope + free text)
5. Apply section (concrete file paths and steps for Claude to act on — must point at REAL project files)

Section order is mandatory: Decisions → Direct edits → Element comments → Apply. Sections with no content are omitted.

Exact format: see [`export-format.md`](export-format.md). Do not deviate.

Empty export (no decisions changed, no direct edits, no comments) → toast warning, modal does not open.

---

## Self-contained file rules

- All CSS inline in `<style>` tags
- All JS inline in `<script>` tags (vanilla JS only — no React, no build step, no npm imports)
- No `<link rel="stylesheet">`, no `<script src="...">`
- No external font fetches, no CDN, no Google Fonts — use system font stacks
- No external images — use inline SVG, base64 data-URIs, or CSS shapes for placeholders
- Must open and work via `file://`

---

## Reference files in this skill directory

- [`template.html`](template.html) — **behavior scaffold** (mechanics demo only; the sample UI inside `.preview-pair` is throwaway illustration to show how the comment / decision / export systems wire up — DO NOT clone it into generated previews)
- [`export-format.md`](export-format.md) — exact markdown shape for the round-trip prompt
