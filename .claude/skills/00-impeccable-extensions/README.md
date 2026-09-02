# Impeccable local extensions

Eight reference documents that existed in the older `impeccable` copy vendored via
`tyfarrago-hub/taste`, and which **current upstream `pbakaus/impeccable` v4.1.3 no longer
ships**. Each was verified as genuinely unique by exact whole-line set comparison against a
2,187-line corpus of the entire upstream skill: all eight scored **0% coverage**.

This directory has no `SKILL.md` and is **not a registered skill**. Nothing loads it
automatically. It is optional reference material, consulted only when a task calls for it —
the same convention as `00-design-references/`.

## Why a sibling directory rather than `impeccable/reference/local-extensions/`

Keeping these outside the impeccable payload means a future upstream update is a clean
wholesale directory replacement, with nothing to carve around.

## Why these are not wired into impeccable's SKILL.md

Referencing them from the canonical `SKILL.md` would mean editing the upstream payload, and
would give impeccable two voices on typography, motion and colour. Upstream stays canonical;
these stay consultable.

| File | Size | Upstream coverage |
|---|---|---|
| `brand.md` | 10,385 B | 0% |
| `teach.md` | 9,178 B | 0% |
| `typography.md` | 8,269 B | 0% |
| `interaction-design.md` | 7,082 B | 0% |
| `motion-design.md` | 5,784 B | 0% |
| `color-and-contrast.md` | 5,769 B | 0% |
| `ux-writing.md` | 4,326 B | 0% |
| `spatial-design.md` | 3,538 B | 0% |

## Deliberately NOT preserved

`craft.md` — upstream retired it as a **"Craft (deprecated alias)"** routing to `init.md` +
`new-work.md`. Preserving the older 14,646 B version would reinstate withdrawn guidance.

Twelve further files (`animate`, `bolder`, `clarify`, `colorize`, `delight`, `layout`,
`live`, `polish`, `shape`, `typeset`, `craft`, `SKILL.md`) exist upstream under the same
names and are actively maintained — rewritten, not additive.

Five more (`cognitive-load`, `heuristics-scoring`, `personas`, `responsive-design`,
`product`) were absorbed inline into upstream `critique.md` and `adapt.md` at 78–98%
coverage; `critique.md:279` documents the inlining.

All seventeen remain recoverable from git at tag `pre-repair-rollback` (`8dc792e`).
