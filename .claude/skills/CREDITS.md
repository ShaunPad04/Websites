# Skill sources, attribution and local modifications

Every skill in this directory was vendored from its upstream repository. Nothing was
hand-written or paraphrased. Commit SHAs below are the exact upstream revisions installed.

Originally installed: 2026-08-31 · **Audited and repaired: 2026-09-02**

---

## Corrections to the 2026-08-31 record

Three claims in the previous version of this file were wrong. They are corrected here and
the reasoning is kept so the same mistakes are not repeated.

| Previous claim | Reality | Consequence |
|---|---|---|
| `impeccable` sourced from `tyfarrago-hub/taste` | True at the time, but **taste's copy was already behind upstream**. `pbakaus/impeccable` is the real source. | The vendored copy sat at 58 files against upstream's 163 — missing the detector engine, hooks, live framework adapters and `critique-storage.mjs`. **Now vendored direct.** |
| Anthropic's `frontend-design` SKILL.md is "byte-identical" to the synced copy | **False.** GitHub 8,260 B vs synced 9,390 B, and the synced copy ships a `LICENSE.txt` the plugin omits. | The conclusion (do not install) was right; the evidence was not. |
| `skill-web-design` has "zero files unique to it" | **False.** Its 33,781 B SKILL.md is entirely unique — 4 modes, 10 Vibe Archetypes, refusal clauses, G/B/P/H gate IDs, OKLCH strategy, the LIBERA Fingerprint Test, brand-register catalogue. | Only its 29 `reference/` files were duplicates. **The skill is now installed, reference-only.** |

A fourth error was in scope rather than fact: `lotfb86/web-design-skills` ships **8 skill
folders** and only 3 were installed. Four of the five omissions are now added; the fifth is
excluded with a stated reason.

---

## Sources

| Skill | Upstream repository | Commit | Direct/derived | Role | License |
|---|---|---|---|---|---|
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) **v4.1.3** | `0330f61` | **Direct** | Driver | MIT |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `58c220f` | Direct | Reference | MIT |
| `design-system`, `brand` | nextlevelbuilder/ui-ux-pro-max-skill | `f232671` | Direct | Explicit | MIT |
| `design-libera` | [liberastudio-mx/skill-web-design](https://github.com/liberastudio-mx/skill-web-design) **v1.1.1** | `b5531d3` | Direct, SKILL.md only | **Reference-only** | see repo |
| `website`, `brandkit`, `emil-design-eng`, `high-end-visual-design`, `imagegen-frontend-web`, `full-output-enforcement` | [tyfarrago-hub/taste](https://github.com/tyfarrago-hub/taste) | `acbb3e9` | Derived | mixed | MIT |
| `web-design-guidelines`, `website-rebuild`, `responsive-design`, `theme-factory`, `local-business-rebuild`, `design-system-generator`, `00-design-references` | [lotfb86/web-design-skills](https://github.com/lotfb86/web-design-skills) | `81644c1` | Direct | mixed | "Use them, adapt them, build on them" |
| `frontend-design-skill` | [Zealotic-spec/frontend-design-skill](https://github.com/Zealotic-spec/frontend-design-skill) | `71d1985` | Direct | **Driver** | MIT |
| `tailwind-ui-rules` | [MarkBenz/claude-code-skills](https://github.com/MarkBenz/claude-code-skills) | `2075b6d` | Direct | Reference | MIT |
| `apple-design-hig` | [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill) | `d0bac1e` | Direct | Reference | from Apple's public HIG |
| `remotion-motion-graphics` | [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) | `1dcbe5e` | Direct | Driver | MIT |
| `visual-preview` | [wenkang-deepblue/frontend-design](https://github.com/wenkang-deepblue/frontend-design) | `17bb943` | Direct | Explicit | MIT |
| `00-impeccable-extensions` | **Local legacy** (was taste's impeccable) | from `8dc792e` | Preserved | Optional reference | MIT |

### Plugins (install to `~/.claude/`, not vendored — see "Ephemerality")

| Plugin | Source | Version | Role |
|---|---|---|---|
| `chrome-devtools-mcp` | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) `b2007ab` | 1.8.0 | MCP + 7 skills. Inspection only, never a design driver |
| `security-guidance` | anthropics/claude-code | 2.0.0 | Tiered; layer 1 only by default |
| `feature-dev` | anthropics/claude-code | 1.0.0 | 3 agents + 1 command. Engineering, never visual design |

---

## Local modifications

Six edits, all mechanical. Nothing else was altered.

1. **`visual-preview`** — upstream skill is named `frontend-design`, colliding with Anthropic's.
   Renamed directory and frontmatter to `visual-preview`; trigger to `/visual-preview`; output
   path to `./.visual-preview/`.
2. **`apple-design-hig`** — upstream is named `apple-design`, colliding with the account-synced
   skill. Renamed directory and frontmatter. The value here is `references/hig/` — 53 HIG
   documents the synced version does not ship.
3. **`website-rebuild`** — upstream lives at `05-website-rebuild/`. Renamed to match its
   frontmatter; data references repointed to `../00-design-references/`.
4. **`local-business-rebuild`** — upstream `06-local-business-rebuild/`. Renamed; two
   `00-design-references/` paths repointed to `../00-design-references/`. **(new 2026-09-02)**
5. **`design-system-generator`** — upstream `08-design-system-generator/`. Renamed; two
   `00-design-references/` paths repointed to `../`. **(new 2026-09-02)**
6. **`responsive-design`**, **`theme-factory`** — upstream `02-` / `04-` prefixes dropped to
   match frontmatter. No content changes. **(new 2026-09-02)**

`design-libera`'s SKILL.md is **unmodified**. Its seven `/ui-ux-libera` references are resolved
externally through root `CLAUDE.md` routing rather than by editing upstream source.

`00-design-references/` and `00-impeccable-extensions/` have no `SKILL.md` and are not
registered as skills. They are shared data.

Excluded from every vendored skill: `.git/`, `.gitignore`, `CONTRIBUTING.md`, `.cursorrules`,
`scripts/tests/`, and README screenshots — development files with no runtime role.
`references/`, `scripts/`, `data/`, `assets/`, `templates/` and license files were preserved.

---

## Preserved local extensions

`00-impeccable-extensions/` holds 8 reference documents that existed in taste's older
`impeccable` and which upstream v4.1.3 no longer ships. Each verified unique by exact
whole-line comparison against a 2,187-line corpus of the entire upstream skill — **all eight
scored 0% coverage**:

`brand.md` · `teach.md` · `typography.md` · `interaction-design.md` · `motion-design.md` ·
`color-and-contrast.md` · `ux-writing.md` · `spatial-design.md`

**Not preserved, with reasons:**

- `craft.md` — upstream retired it as a *"Craft (deprecated alias)"* routing to `init.md` +
  `new-work.md`. Keeping the older 14,646 B version would reinstate withdrawn guidance.
- 12 files (`animate`, `bolder`, `clarify`, `colorize`, `delight`, `layout`, `live`, `polish`,
  `shape`, `typeset`, `craft`, `SKILL.md`) — exist upstream under the same names, actively
  maintained. Rewritten, not additive.
- 5 files (`cognitive-load`, `heuristics-scoring`, `personas`, `responsive-design`, `product`)
  — absorbed inline into upstream `critique.md` and `adapt.md` at 78–98% coverage.
  `critique.md:279` documents the inlining.

All 17 remain recoverable from git tag `pre-repair-rollback` (`8dc792e`).

---

## Deliberately not installed

| Requested | Reason |
|---|---|
| [anthropics/claude-code `frontend-design`](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) | The account-synced copy is **newer** (9,390 B vs 8,260 B) and ships a `LICENSE.txt` the plugin omits. Installing would downgrade. |
| [liberastudio-mx/skill-ui-ux-Libera](https://github.com/liberastudio-mx/skill-ui-ux-Libera) `324e7d5` | A fork of ui-ux-pro-max v2.5.0. **Smaller than ours in every one of 31 shared data files**; `core.py` 12,393 B vs 41,234 B. Its two "unique" CSVs are Chinese-language backups whose own header states *"the current search engine and CLI do not read or execute this file"*, referenced by no script. Routed via CLAUDE.md instead. |
| `skill-web-design/reference/` (29 files) | 26 byte-identical to `impeccable/reference/`. The other 3 are **stale intermediates** — its `critique.md` is 16,154 B against upstream's 42,693 B. |
| `01-frontend-design` (web-design-skills) | 3 sections; its one distinct idea (DESIGN.md output) is done properly by `design-system-generator`. Role covered by `frontend-design-skill`. |
| `07-azerbaijan-website-build` (web-design-skills) | Tri-lingual AZ/RU/EN Astro builds for Azerbaijani businesses — outside the intended UK client workflow. Its two generic files (`accessibility-spec.md`, `contrast-check.js`) are redundant against the existing axe-core + Lighthouse gate at accessibility 100. **Excluded deliberately, not by omission.** |
| taste: `gpt-taste`, `image-to-code` | Codex/GPT-targeted by their own descriptions. |
| taste: `stitch-design-taste` | Google Stitch-specific. Its DESIGN.md role is covered better by `design-system-generator` (18,808 B, generic vs 11,859 B, tool-locked). |
| taste: `cosmic-glass-dashboard`, `industrial-brutalist-ui`, `minimalist-ui` | Fixed visual identities. Bespoke luxury work chooses a direction per client. |
| taste: `design-taste-frontend`, `redesign-existing-projects` | Both claim build/redesign requests — competing drivers. Covered by `frontend-design-skill` and `website-rebuild` + `impeccable critique`. |
| taste: `imagegen-frontend-mobile` | iOS/Android screen concepts. The web sibling is installed; this waits until there is app work. |
| taste: 17 standalone verbs | All exist as `impeccable/reference/<verb>.md` in v4.1.3. Installing them standalone recreates the competing-driver problem the consolidation solved. |
| ui-ux-pro-max: `banner-design`, `design`, `slides`, `ui-styling` | Ad banners and presentations, not websites. `design` needs Gemini/Atlas keys; `ui-styling` is shadcn/Radix-specific with 5.7 MB of bundled fonts. |
| MarkBenz: `audit-design`, `color-palette`, `generate-component` | Overlap `impeccable audit`, ui-ux-pro-max's 192 palettes, and `tailwind-ui-rules`. |
| A `code-simplifier` plugin | **Does not exist** in anthropics/claude-code. The built-in `/simplify` and `/code-review` cover it. |
| shadcn/ui, Sentry, Stripe, CMS, Supabase, ORM, auth/email/SMS/CRM/analytics/consent/search, Unlighthouse | **Per-project, never global.** See root `CLAUDE.md`. |

**Do not run `frontend-design-skill/install.sh --with-catalog`.** It fetches 14 third-party
skills including `ui-ux-pro-max`, `impeccable`, `emil-design-eng` and `high-end-visual-design`
— all already present or deliberately excluded here.

---

## Ephemerality — read before trusting the plugin list

Claude Code web sessions are ephemeral. **`~/.claude/` is wiped when the container is
reclaimed**, so the three plugins above do *not* survive a session. Skills in this directory
are committed and therefore do. Reinstall commands are in root `CLAUDE.md` → Environment.

## Updating

Re-clone upstream, diff against the vendored copy, re-apply the six local modifications above.
The commit SHAs in the table are the current baseline. `impeccable` now tracks
`pbakaus/impeccable` directly — do **not** take it from `taste` again; that indirection is what
caused the version lag corrected on 2026-09-02.
