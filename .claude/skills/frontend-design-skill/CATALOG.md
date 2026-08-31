# The catalog

Every design skill worth installing next to `frontend-design-skill`, with where it actually comes from.

This file is the part that keeps moving. New good design skills appear every week; when one is genuinely better than what's here, it goes in and the weak one goes out. Open an issue with a candidate.

**Attribution policy.** Nothing in this repo is a copy of someone else's skill. The catalog links to sources and [`install.sh`](install.sh) fetches from them, so authors keep their stars, their license and their name. Where a skill's author or license could not be verified, it says so — here and under [Unattributed](#unattributed).

Legend: **auto** = installed by `install.sh` · **manual** = you install it yourself, source unverified.

---

## Craft and motion — `emilkowalski/skills`

[github.com/emilkowalski/skills](https://github.com/emilkowalski/skills) · MIT · ⭐27.9k · **auto**

Emil Kowalski is the design engineer behind [Sonner](https://sonner.emilkowal.ski) and [Vaul](https://vaul.emilkowal.ski). This is the single highest-signal source in the catalog, and eight of the skills below come from it.

| Skill | What it gives you |
|---|---|
| `emil-design-eng` | The invisible details that make software feel great — component design, animation decisions, UI polish. The one to read first. |
| `apple-design` | Apple's approach to fluid, physical motion translated to the web: gestures, springs, drag/swipe/sheets, momentum, interruptible transitions, translucency. Distilled from WWDC design talks. |
| `animation-vocabulary` | Reverse-lookup glossary: "the bouncy thing when a popover opens" → *Pop in*; "the iOS rubber-band scroll" → *Rubber-banding*. For naming an effect so you can prompt for it. |
| `find-animation-opportunities` | Scans a codebase for places that don't animate but should — and rejects everything that shouldn't. Read-only; proposes exact values. |
| `improve-animations` | Surveys all motion in a project and produces a prioritized audit plus self-contained plans a cheaper model can execute. |
| `review-animations` | Reviews animation in a diff against a high craft bar. Defaults to flagging; approval is earned. |
| `pick-ui-library` | Curated, opinionated picks for OTP inputs, charts, command menus, virtualization, drag and drop, toasts, state, styling. |
| `prototype` | Builds several genuinely different versions of one UI piece behind a visual picker, so you flip through them live and promote the one that feels right. |

## Impeccable — `pbakaus/impeccable`

[github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable) · Apache-2.0 · **auto**

| Skill | What it gives you |
|---|---|
| `impeccable` | 23 commands (`polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`…) plus 59 deterministic detector rules that run with no LLM and no API key. Started from Anthropic's `frontend-design` and went considerably further. Handles live browser iteration. |

Install its own way instead if you prefer: `npx impeccable install`, then `/impeccable init`.

## Design intelligence — `nextlevelbuilder/ui-ux-pro-max-skill`

[github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · MIT · **auto**

| Skill | What it gives you |
|---|---|
| `ui-ux-pro-max` | A searchable database, not prose: 84 styles, 192 color palettes, 74 font pairings, 192 product types with reasoning rules, 98 UX guidelines, 25 chart types across 22 stacks. This is where palettes and font pairs come from when the project has no brand kit. |

## Stack-specific — `mrgoonie/claudekit-skills`

[github.com/mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills) · **no license stated** · **auto**

| Skill | What it gives you |
|---|---|
| `ui-styling` | shadcn/ui + Radix + Tailwind specifics: accessible dialogs, dropdowns, forms and tables, theming, dark mode, consistent styling patterns. Only useful on that stack — on any other, skip it. |

The repo ships no license file, which means the author keeps every right by default. So `install.sh` clones it from upstream onto your machine instead of vendoring a copy here — nothing of theirs is redistributed by this repo, and the skill is yours to use on the same terms as if you had cloned it yourself. [@mrgoonie](https://github.com/mrgoonie): a `LICENSE` would settle this properly, and if you'd rather not be listed at all, open an issue and it comes out.

## Taste and premium design — `Leonxlnx/taste-skill`

[github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) · MIT · ⭐77.6k · **auto**

Anti-slop skills: override common LLM UI defaults (centered heroes, purple gradients, Inter everywhere) with prescriptive, metrics-driven design rules. Three of the six skills in this repo are bundled here; the other three (`redesign-existing-projects`, `industrial-brutalist-ui`, `stitch-design-taste`) are documented under [Unattributed](#unattributed) below pending verification against the same repo.

| Skill | What it gives you |
|---|---|
| `design-taste-frontend` | Senior UI/UX engineer persona enforcing metric-based rules (design variance, motion intensity, visual density) so output stops reading as generic AI slop. |
| `high-end-visual-design` | The exact fonts, spacing, shadows, card structures and animations that make a site feel expensive — and a block list of the defaults that make AI design look cheap. |
| `minimalist-ui` | Clean editorial interfaces: warm monochrome, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows. |

## Anthropic built-ins

Shipped with Claude Code, nothing to install.

| Skill | What it gives you |
|---|---|
| `frontend-design` | The original. Direction and POV, a display+body pair, one justified risk, copywriting. Enabled via the `frontend-design` plugin. |
| `dataviz` | Charts done right: form heuristic, a color formula with a runnable validator, mark specs, interaction rules. Load it **before** the first line of chart code. |
| `artifact-design` | Calibrates design investment for a published Artifact page. Mandatory before publishing one. |

---

## Unattributed

These are in wide circulation across dozens of mirror repos with no license file, no author field and no canonical upstream. They are **not** bundled here and `install.sh` will not fetch them — publishing someone's work without their name on it is not a thing this repo does.

They are listed because they are genuinely useful and because listing them is how the author gets found.

**Are you the author of one of these? [Open an issue](../../issues/new) and it moves up into a proper section with your name and your link on it.**

| Skill | Internal `name:` | What it gives you |
|---|---|---|
| `redesign-skill` | `redesign-existing-projects` | Audits an existing site, identifies generic AI patterns, applies high-end standards without breaking functionality. Framework-agnostic. |
| `brutalist-skill` | `industrial-brutalist-ui` | Swiss typographic print fused with military terminal: rigid grids, extreme type scale contrast, analog degradation. For dashboards and editorial sites that should feel like declassified blueprints. |
| `stitch-skill` | `stitch-design-taste` | Generates agent-friendly `DESIGN.md` files for Google Stitch — strict typography, calibrated color, asymmetric layouts. |
| `imagegen-frontend-web` | same | Image direction for premium website design references. One horizontal image per section — eight sections means eight images, never one compressed board. |
| `imagegen-frontend-mobile` | same | The same discipline for mobile: app-native screen concepts and flows, multi-screen consistency, clean phone mockup framing. |

The three style presets (`minimalist`, `brutalist`, `stitch`) each carry their own aesthetic and will fight a project's brand kit. `frontend-design-skill` never wires them up on its own — they are opt-in by name.

## Deliberately excluded

| Skill | Why |
|---|---|
| `taste-skill-v1` | Superseded by the v2 rewrite. Only install it if you need exact backward compatibility. |
| `gpt-tasteskill` | Written for GPT/Codex, not Claude. Its Python-driven randomization does not transfer. |
| `image-to-code-skill` | Same — built around Codex's image workflow. |

---

## References, not skills

| What | Where |
|---|---|
| **DESIGN.md library** — teardowns of 74 real design systems (Linear, Vercel, Stripe, Apple, Notion, Raycast, Figma, Supabase, Framer, Tesla, Nike, Spotify…). Colors, typography, layout, elevation, shapes, components, do's and don'ts, responsive behavior. | [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) · MIT |
| **shadcn/ui** — base UI primitives (button, dialog, form, table, toast) via the `shadcn` MCP server, plus any third-party registry added to the project's `components.json`. | [ui.shadcn.com](https://ui.shadcn.com) · MIT |
| **21st.dev MCP** — real components and themes instead of invented ones. Call order matters for quota: `get_inspiration` → `search` → `get_theme` (all free) → `get_component` (metered). | [21st.dev](https://21st.dev) |
