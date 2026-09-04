# Account-sync skills — provenance

Canonical source for the 33 skills uploaded to claude.ai account sync. Every
row was verified by cloning upstream at the recorded SHA and diffing, not by
assumption. Where a claim says *byte-identical* or *superset*, an actual `diff`
produced that result.

Audited: 2026-09-04. Regenerate the upload package with
`scripts/package-account-sync-skills.sh`; verify with `--verify`.

---

## Why these live here and not only in `.claude/skills/`

Account-synced skills follow the account into **every** Claude Code cloud
session. Plugins and `~/.claude/skills` do not — `~/.claude` is wiped when a
managed container is recycled. This directory is therefore the canonical,
reproducible source from which the account-sync upload package is built.

Account sync **does** preserve multi-file skills. Measured, not assumed: the
first-party `docx` skill syncs as 61 files across 11 directories, `pptx` as 56,
`xlsx` as 53. Nothing here was flattened to `SKILL.md` to make it sync.

---

## The 33 canonical skills

| Skill | Files | Source repo | SHA | Derivation | Role |
|---|---:|---|---|---|---|
| ui-ux-pro-max | 47 | nextlevelbuilder/ui-ux-pro-max-skill | `f3ac195224eac1eb0dfe1a3059c2a6add78ffbe3` | upstream, `scripts/tests` removed | **Reference/data — never driver** |
| apple-design-hig | 57 | dickwu/apple-design-skill | `d0bac1e765a27a696839e62962e36330ce72f0b7` | upstream, folder renamed | Reference-only |
| design-libera | 35 | liberastudio-mx/skill-web-design | `b5531d3c4ff15154487626c0e6e3bffcdc3b5ce1` | upstream, unmodified | Reference-only — never driver |
| website-rebuild | 19 | ShaunPad04/premium-webdev | `93c10e1471b42aa6bdb76437f9023191d99b520b` | + embedded design-references | **Driver** — rebuild from URL |
| local-business-rebuild | 16 | lotfb86/web-design-skills | `81644c107354792c99fc9229cf41bfd9ff2c50e2` | `06-`, + embedded design-references | **Driver** |
| design-system-generator | 14 | lotfb86/web-design-skills | `81644c107354792c99fc9229cf41bfd9ff2c50e2` | `08-`, + embedded design-references | **Driver** |
| design-system | 26 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Driver |
| visual-preview | 4 | wenkang-deepblue/frontend-design | `17bb94344af0224dace7b42875e978f00d5dd6bc` | functional core only | Explicit-only |
| graphify | 12 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Specialist driver — graphs/diagrams |
| tailwind-ui-rules | 7 | MarkBenz/claude-code-skills | `2075b6d4df80919685249c6643273081899aa5bf` | **byte-identical** upstream, then injection fix | Reference-only |
| brand | 17 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Driver |
| theme-factory | 21 | lotfb86/web-design-skills | `81644c1073…` | `04-`, unmodified | **Driver** |
| website | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | **Driver** — landing pages |
| imagegen-frontend-web | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Explicit-only |
| image-to-code | 1 | tyfarrago-hub/taste | `acbb3e9c9051e096cb9e5e5cc1af88d56bc05459` | upstream | Explicit-only |
| frontend-design-skill | 3 | Zealotic-spec/frontend-design-skill | `71d1985d2044a4373871fe1f8ce87aa695fc58d4` | **local superset** (+CATALOG.md) | **PRIMARY DRIVER — new frontend** |
| emil-design-eng | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Reference-only |
| remotion-motion-graphics | 5 | haidrrrry/claude-remotion-skill | `1dcbe5e3fc6cf970bd10d3cc05f0a8a5d19d0383` | **local superset** (+LICENSE) | Driver — rendered video |
| brandkit | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Driver |
| redesign-existing-projects | 1 | tyfarrago-hub/taste | `acbb3e9c90…` | upstream | Explicit-only |
| premium-motion-direction | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Motion art direction |
| gsap-core | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | **Driver — advanced motion** |
| gsap-scrolltrigger | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | GSAP companion |
| gsap-plugins | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | GSAP companion |
| gsap-frameworks | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | GSAP companion |
| gsap-utils | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | GSAP companion |
| gsap-react | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | GSAP companion |
| gsap-timeline | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | GSAP companion |
| gsap-performance | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | GSAP companion |
| high-end-visual-design | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Reference-only |
| responsive-design | 1 | lotfb86/web-design-skills | `81644c1073…` | `02-`, unmodified | **Driver** |
| full-output-enforcement | 1 | tyfarrago-hub/taste | `acbb3e9c90…` | upstream | Explicit-only |
| web-design-guidelines | 1 | ShaunPad04/premium-webdev | `93c10e1471…` | via premium-webdev | Reference-only |

**Total: 33 skills · 302 files · 6.5 MB.**

---

## Modifications made for account-sync compatibility

Each change was required for the skill to *function* once synced. None was
cosmetic, and none removed capability.

### 1. `${CLAUDE_PLUGIN_ROOT}` → `${CLAUDE_SKILL_DIR}` — `ui-ux-pro-max`

Upstream ships as a **plugin**, so its `SKILL.md` invoked scripts via
`${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/…` (11 occurrences).
`CLAUDE_PLUGIN_ROOT` is only substituted for *plugin* skills; in an
account-synced skill it never resolves, so every script call would have failed
silently. Rewritten to `${CLAUDE_SKILL_DIR}/scripts/…`, which the docs define as
the correct substitution for non-plugin skills.

Verified after the change, from an unrelated working directory:

```
python3 ${CLAUDE_SKILL_DIR}/scripts/validate_data.py
  → OK: validated 12 domain files, 22 stack files, and ui-reasoning.csv
python3 ${CLAUDE_SKILL_DIR}/scripts/search.py "luxury minimal agency" --domain style
  → minimalism-and-swiss-style (full record)
python3 ${CLAUDE_SKILL_DIR}/scripts/design_system.py "premium monochrome agency" -p TestCo
  → full design system rendered
```

Data retained: 88 styles · 192 palettes · 1,934 Google fonts · 74 typography
pairings · 17 motion presets · 119 UX guidelines · 22 stack files · 44
React-performance rows · 192 ui-reasoning rows.

### 2. Dynamic context injection removed — `tailwind-ui-rules`

Upstream used a bang-prefixed shell injection to inline `design-system.md`.
Claude Code **never executes those in a skill synced from a claude.ai account**.
It would have produced nothing, silently. Rewritten as an explicit instruction
to read `design-system.md`, which works in every context. Behaviour preserved,
including the `NO_DESIGN_SYSTEM_FILE` fallback branch.

### 3. Shared design references embedded — 3 skills

`00-design-references/` is shared data with no `SKILL.md`, so it cannot sync as
a standalone skill. Three skills referenced it across a directory boundary
(`../00-design-references/…`), which dangles once each skill syncs
independently.

The 13-file reference set is therefore embedded into each consumer as
`design-references/`, and the paths rewritten:

| Skill | Embedded | Paths rewritten |
|---|---|---|
| `website-rebuild` | 13 files | `../00-design-references/` → `design-references/` |
| `local-business-rebuild` | 13 files | `00-design-references/` → `design-references/` |
| `design-system-generator` | 13 files | `00-design-references/` → `design-references/` |

Original provenance: `.claude/skills/00-design-references/` in this repo
(`93c10e1471…`), retained here as the source of truth for regenerating the
embedded copies. All rewritten paths were confirmed to resolve. Every synced
skill is independently functional.

### 4. Invocation control — 5 skills

`disable-model-invocation: true` added to `visual-preview`,
`full-output-enforcement`, `image-to-code`, `redesign-existing-projects` and
`imagegen-frontend-web`. A duplicate-driver scan showed nine skills whose
descriptions would auto-claim ordinary design requests; these five are meant to
run only when explicitly asked for. No other frontmatter was altered, and
nothing was changed merely to affect slash-menu visibility.

### 5. Identity fix — `apple-design-hig`

Folder renamed from `apple-design` to `apple-design-hig` to avoid colliding with
other Apple-design skills. The frontmatter `name:` still read `apple-design`,
which mismatched the folder and would have caused discovery ambiguity. Set to
`apple-design-hig` so folder and name agree.

---

## Superseded — deliberately NOT included

| Item | Superseded by | Evidence |
|---|---|---|
| taste `impeccable` (58 files) | upstream Impeccable **v4.1.3** plugin (163 files, 114 `.mjs`) | `diff -rq` proved the old `.claude/skills/impeccable` here was **byte-identical** to `taste/skills/impeccable` — a taste-derived copy, not upstream |
| taste `ui-ux-pro-max` (28 files) | upstream `ui-ux-pro-max` (47 files) | stale subset |
| 17 taste refinement verbs — `adapt` `animate` `audit` `bolder` `clarify` `colorize` `critique` `delight` `distill` `harden` `layout` `optimize` `overdrive` `polish` `quieter` `shape` `typeset` | Impeccable plugin `reference/` | upstream consolidated them so they stop competing with their own parent |
| `liberastudio-mx/skill-ui-ux-Libera` engine | `ui-ux-pro-max` | duplicate engine (`search.py`/`core.py`/`design_system.py`, same CSV domains) at 1.74 MB vs 3.57 MB — smaller and older |

## Intentionally excluded

| Item | Reason |
|---|---|
| `07-azerbaijan-website-build` | Region-specific workflow, not reusable |
| MarkBenz `audit-design`, `color-palette`, `generate-component` | Duplicate Impeccable / design-system capability |
| taste `cosmic-glass-dashboard`, `industrial-brutalist-ui`, `minimalist-ui` | Fixed aesthetic presets that would fight the primary conductor |
| Anthropic `frontend-design` | Kept as a **plugin**, disabled by default — a second automatic conductor would compete with `frontend-design-skill` |
| Impeccable | **Plugin only** (v4.1.3). Never account-synced. |

## Optional, not included — available if wanted

`imagegen-frontend-mobile`, `design-taste-frontend`, `gpt-taste`,
`stitch-design-taste` (all `tyfarrago-hub/taste` `acbb3e9c90…`). Unique but
redundant against the current set; left out to avoid driver competition.

---

## Known upstream imperfections — documented, not patched

Nothing below was fabricated or silently "fixed". Inventing a missing upstream
file would be worse than the gap.

1. **`design-libera` references `reference/live.md` three times; the file does
   not exist upstream.** Confirmed absent from `liberastudio-mx/skill-web-design`
   at `b5531d3c4f…` — an upstream defect, not a staging error. Impact is limited:
   design-libera is reference-only, and the three references sit in
   `brand.md`, `typeset.md` and `colorize.md` pointing at a params contract.
   Re-check upstream before assuming it is still missing.

2. **`frontend-design-skill/CATALOG.md`** links to `install.sh` and
   `../../issues/new` — repo-level artifacts that do not exist inside a synced
   skill. Harmless: `CATALOG.md` is an informational catalogue, not an operative
   instruction file.
