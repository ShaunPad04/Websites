# Skill sources, attribution and local modifications

Every skill in this directory was vendored from its upstream repository. Nothing was
hand-written or paraphrased. Commit SHAs below are the exact upstream revisions installed.

Installed: 2026-08-31

## Sources

| Skills installed | Upstream repository | Commit | License |
|---|---|---|---|
| `ui-ux-pro-max`, `ui-styling`, `design`, `design-system`, `brand` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `f232671` | MIT |
| `adapt`, `animate`, `audit`, `bolder`, `brandkit`, `clarify`, `colorize`, `critique`, `delight`, `distill`, `emil-design-eng`, `harden`, `high-end-visual-design`, `image-to-code`, `imagegen-frontend-web`, `impeccable`, `layout`, `optimize`, `overdrive`, `polish`, `quieter`, `shape`, `typeset`, `website` | [tyfarrago-hub/taste](https://github.com/tyfarrago-hub/taste) | `acbb3e9` | MIT |
| `web-design-guidelines`, `website-rebuild`, `00-design-references` (data) | [lotfb86/web-design-skills](https://github.com/lotfb86/web-design-skills) | `81644c1` | "Use them, adapt them, build on them" (README) |
| `frontend-design-skill` | [Zealotic-spec/frontend-design-skill](https://github.com/Zealotic-spec/frontend-design-skill) | `71d1985` | MIT |
| `tailwind-ui-rules` | [MarkBenz/claude-code-skills](https://github.com/MarkBenz/claude-code-skills) | `2075b6d` | MIT |
| `apple-design-hig` | [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill) | `d0bac1e` | Derived from Apple's public HIG docs |
| `remotion-motion-graphics` | [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) | `1dcbe5e` | MIT |
| `visual-preview` | [wenkang-deepblue/frontend-design](https://github.com/wenkang-deepblue/frontend-design) | `17bb943` | MIT |

`taste` itself credits upstream authors in its own CREDITS.md — notably Emil Kowalski
(`emil-design-eng`) and the `impeccable` project. `frontend-design-skill/CATALOG.md` is
retained here as it documents further attribution.

## Local modifications

Three edits were made, all of them mechanical. Nothing else was altered.

1. **`visual-preview`** — upstream skill is named `frontend-design`, which collides with
   Anthropic's official `frontend-design` skill. Renamed the directory and the frontmatter
   `name:` to `visual-preview`; updated its slash trigger to `/visual-preview` and its
   default output path to `./.visual-preview/`.

2. **`apple-design-hig`** — upstream skill is named `apple-design`, which collides with the
   account-synced `apple-design` skill. Renamed the directory and frontmatter `name:` to
   `apple-design-hig`. The value here is `references/hig/` — 53 HIG documents the synced
   version does not ship.

3. **`website-rebuild`** — upstream lives at `05-website-rebuild/` and refers to its data
   folder as `00-design-references/`. Directory renamed to match its frontmatter `name:`
   (`website-rebuild`), and the two data references repointed to `../00-design-references/`.

`00-design-references/` has no `SKILL.md` and is not registered as a skill. It is shared
data (DESIGN.md teardowns of Stripe, Apple, Linear, Vercel, Airbnb, Notion, Nike, Spotify,
Shopify, Wise) read by `website-rebuild`.

Excluded from every vendored skill: `.git/`, `.gitignore`, `CONTRIBUTING.md`,
`.cursorrules`, and `scripts/tests/` — development files with no runtime role.
`references/`, `scripts/`, `data/`, `assets/`, `templates/` and license files were preserved.

## Deliberately not installed

| Requested | Reason |
|---|---|
| [anthropics/claude-code `frontend-design`](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) | Its `SKILL.md` is **byte-identical** to the already account-synced `frontend-design` skill. Installing it would create a duplicate. |
| [liberastudio-mx/skill-web-design](https://github.com/liberastudio-mx/skill-web-design) | A strict subset of `impeccable`. Of its 29 reference files, 29 exist in `impeccable/reference/` and 26 are byte-identical; **zero files are unique to it**. Its own NOTICE.md confirms the derivation. |

Also dropped as duplicates within the requested set:
- `taste`'s bundled `ui-ux-pro-max` (564 KB / 12 files) — superseded by the full upstream version (3.3 MB / 47 files).
- `taste`'s `gpt-taste` — written for GPT/Codex; its Python randomization does not transfer to Claude.
- `taste`'s `redesign-existing-projects` — overlaps `website-rebuild`, which is the more complete pipeline.
- `taste`'s pure style presets (`cosmic-glass-dashboard`, `industrial-brutalist-ui`, `minimalist-ui`, `stitch-design-taste`) and `design-taste-frontend`, `full-output-enforcement`, `imagegen-frontend-mobile`.
- `ui-ux-pro-max`'s `slides` and `banner-design` — presentation/ad-banner work, not websites.
- `MarkBenz`'s `audit-design` (overlaps `audit`), `color-palette` (overlaps ui-ux-pro-max's 192 palettes), `generate-component` (overlaps `ui-styling`).

**Do not run `frontend-design-skill/install.sh --with-catalog`.** It fetches 14 third-party
skills including `ui-ux-pro-max`, `impeccable`, `emil-design-eng`, `high-end-visual-design`,
`design-taste-frontend` and `minimalist-ui` — all already present or deliberately excluded here.

## Consolidation (second pass)

The first pass installed 36 skills. Too many of them claimed the same requests, so 20 were
removed. `CLAUDE.md` at the repo root now defines explicit precedence for the 16 that remain.

**Removed — already inside `impeccable`.** All 17 exist as `impeccable/reference/<verb>.md`,
and `impeccable`'s own description enumerates them, so both fired on the same request.
`impeccable`'s copies are frequently the richer text (`polish` 12,010 vs 9,549 bytes;
`shape` 9,473 vs 5,192; `colorize` 8,019 vs 6,897), so nothing was lost:

`adapt` `animate` `audit` `bolder` `clarify` `colorize` `critique` `delight` `distill`
`harden` `layout` `optimize` `overdrive` `polish` `quieter` `shape` `typeset`

Invoke them as `impeccable <verb>`.

**Removed — three more:**

| Skill | Reason |
|---|---|
| `image-to-code` | Its own description says "skill for Codex" and instructs "In Codex, it must…". Written for GPT, not Claude. |
| `ui-styling` | shadcn/Radix-specific, and that stack was declined. Competed with `tailwind-ui-rules` on Tailwind implementation. Also 5.7 MB of bundled TTF fonts. |
| `design` | Logo/CIP/banner/icon/social-image generation requiring Gemini or Atlas Cloud API keys, which are not configured. Competed with `brand` and `design-system`. |

Remaining: 16 skills, 6.2 MB (from 36 skills, 13 MB).

## Official upstream install commands

Vendoring into this repository was chosen because Claude Code web sessions run in ephemeral
containers: `~/.claude/skills/` is destroyed when a session ends, so the install methods in
the upstream READMEs would not persist. Skills committed here load automatically in every
future session on this repo, and travel with a `git clone`.

On a **local machine**, the upstream methods work as documented:

```bash
# Anthropic frontend-design (already synced to this account — not needed)
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-code-plugins

# UI/UX Pro Max
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
# or: npm install -g ui-ux-pro-max-cli && uipro init --ai claude

# Tailwind UI Rules
/plugin marketplace add MarkBenz/claude-code-skills
/plugin install claude-code-skills@claude-code-skills

# taste
git clone https://github.com/tyfarrago-hub/taste.git
cp -r taste/skills/* ~/.claude/skills/

# Remotion Motion Graphics
git clone https://github.com/haidrrrry/claude-remotion-skill.git
cp -r claude-remotion-skill/remotion-motion-graphics ~/.claude/skills/
```

Note: `dickwu/apple-design-skill`'s README instructs `claude install-skill <path>`. That
command does not exist in Claude Code 2.1.42 — the README is outdated. Copy the directory
instead.

## Updating

Re-clone the upstream repo, diff against the vendored copy, and re-apply the three local
modifications listed above. The commit SHAs in the table are the current baseline.

---

## Engineering-layer skills (vendored 2026-09-03)

Not design skills. Added to fill genuine gaps, not to duplicate existing design guidance.

| Skills | Upstream | Commit | Licence |
|---|---|---|---|
| `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-performance`, `gsap-frameworks` (8) | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) — official GreenSock | `aed9cfd3277740755f6bfc1155c7aa645403b760` | see upstream |
| `penetration-testing-with-strix`, `web-app-penetration-testing`, `api-security-testing`, `owasp-top-10-testing`, `find-security-vulnerabilities-in-code`, `fix-security-vulnerabilities-with-strix`, `ci-security-scanning-with-strix`, `application-security-testing`, `managed-pentesting-with-strix` (9) | [usestrix/strix](https://github.com/usestrix/strix) | `5d015df6b1b58934152f897e37d3032f0dc32e0d` | Apache-2.0 |

Vendored verbatim, no local modifications. Upstream global installs are
`npx skills add https://github.com/greensock/gsap-skills` and `npx skills add usestrix/strix`;
vendoring here means they load in this repo without a global install.

Two CLI tools install a skill of their own rather than being vendored — see
`docs/premium-webdev-setup.md`: **Graphify** (`graphify install --platform claude`) and
**Ponytail** (Claude Code plugin marketplace).

## Ponytail skills (6) — vendored 2026-09-03

Source: https://github.com/DietrichGebert/ponytail
Commit: `2ed6c52c9d7e5e56942508591085fd45dea277d3` (2026-08-08) · package version 4.9.0
Licence: MIT — © 2026 DietrichGebert. Full text at `.claude/skills/ponytail/LICENSE`.

Vendored verbatim from the upstream `skills/` directory:
`ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`

**Skills only — no lifecycle hooks, no plugin manifest, no user-level config.** Ponytail's
plugin runtime (`/plugin`, `/ponytail lite|full|ultra`, `PONYTAIL_DEFAULT_MODE`,
`~/.config/ponytail/config.json`) is unavailable in the hosted Claude Code workspace, so no
mode is set and none is claimed. The Lite-equivalent behaviour is enforced by the
"Implementation discipline" rule in the root `CLAUDE.md`. The upstream plugin remains installed
in the Claude Desktop registry and is untouched.

## Graphify skill — vendored 2026-09-03

Source: https://github.com/Graphify-Labs/graphify
Commit: `33362d969292b57eda82f3fbd9eb5f3f5bc9bbc2` (2026-08-30) · CLI version 0.9.53
Licence: Apache-2.0 — `LICENSE` and `NOTICE` retained at `.claude/skills/graphify/`.

Vendored: `SKILL.md` plus the 8 `references/*.md` files, generated by the official
`graphify install --project` and then reduced to the skill payload only.

**Deliberately NOT vendored:** the `.claude/settings.json` that command also writes, which
registers `PreToolUse` hooks (`graphify hook-guard`) firing on every `Bash|Grep` and
`Read|Glob` call. In a hosted workspace where the CLI is absent that hook fails on every read
and search. Strict mode (`--strict`, `GRAPHIFY_HOOK_STRICT`) is off and was never enabled;
the git post-commit hook was never installed.

The skill carries durable architectural guidance. Generating an actual graph needs the CLI,
installed on demand and only when a graph is genuinely wanted:

    uv tool install graphifyy && graphify update .

Output (`graphify-out/`, `.graphify/`) is excluded by both `.gitignore` and `.claudeignore`.
