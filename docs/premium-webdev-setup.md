# Premium web-dev toolchain — Windows install runbook

Every command below was read from each project's **current** README/docs (cloned from source,
not recalled from memory) and, where the tool is cross-platform, executed and verified on Linux
in a Claude Code web session on 2026-09-03. Versions resolved that day are recorded.

> **Why this file exists.** The Claude Code *web* session that produced it runs in an ephemeral
> Ubuntu container, not on your Windows PC. Skills vendored into `.claude/skills/` travel with
> this repo via git. Global CLIs do not — install those on Windows with the commands here.

---

## 0. Prerequisites (check before installing)

```powershell
claude --version          # Claude Code
node -v                   # CodeBurn needs >= 22.13; OmniRoute needs >=22.22.2 <23 or >=24 <27
python --version          # Graphify needs >= 3.10
uv --version              # or: winget install astral-sh.uv
docker version            # Strix only
where.exe claude          # note whether it resolves to claude.exe / claude.cmd
```

Do not reinstall anything that already works.

---

## 1. CodeBurn — Claude diagnostics

Verified: **0.9.23**, `npm install -g codeburn`.

```powershell
npm install -g codeburn
codeburn --version
codeburn optimize                 # read-only scan of sessions + ~/.claude
codeburn optimize --format json   # machine-readable
```

Windows also ships a tray app: `codeburn menubar`, or the Microsoft Store build.
Everything is local — no proxy, no API keys.

**Rule: never run `codeburn optimize --apply` unattended.** Triage findings as SAFE /
OPTIONAL / NOT RECOMMENDED first. Its `unused-skills` finding cannot tell "unused" from
"installed for a workflow you run monthly", and will happily suggest archiving skills you
deliberately keep.

---

## 2. Ponytail — implementation discipline

Claude Code install is a **plugin marketplace**, two separate prompts:

```
/plugin marketplace add DietrichGebert/ponytail
```
```
/plugin install ponytail@ponytail
```

Needs `node` on PATH (it runs two lifecycle hooks).

**Ponytail's own default is `full`. You want `lite`.** Set it once:

```powershell
# %APPDATA%\ponytail\config.json
{ "defaultMode": "lite" }
```

or `setx PONYTAIL_DEFAULT_MODE lite`.

Commands: `/ponytail [lite|full|ultra|off]`, `/ponytail-review`, `/ponytail-audit`,
`/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`.

Mapping for this repo's work: creative + normal → lite · bug fixing → lite, full when
justified · refactoring → full, deliberately · experimental visual → lite or off ·
final review → `/ponytail-review`.

---

## 3. Graphify — architectural awareness

Verified: **0.9.53**, PyPI package is `graphifyy` (double-y — other `graphify*` packages
are unaffiliated). CLI is `graphify`.

```powershell
uv tool install graphifyy
graphify install --platform claude     # or --platform windows
graphify --version
```

Then in Claude Code: `/graphify .` → writes `graphify-out/` (graph.html, GRAPH_REPORT.md,
graph.json). Query with `graphify query "..."`, `graphify path "A" "B"`, `graphify explain "X"`.

Code parsing is local tree-sitter AST — no LLM, nothing leaves the machine.

**Hooks — deliberately not installed.** `graphify install` alone installs only the skill.
`graphify hook install` (git auto-rebuild) and `graphify install --project --strict` (blocks
the first raw source read of a session) are both opt-in. Strict mode fights normal frontend
work; leave it off. Add hooks later only if you want commit-time graph rebuilds.

Generated artifacts are ignored in both `.gitignore` and `.claudeignore` in this repo.

---

## 4. GSAP AI Skills — motion engineering

Verified: 8 skills, cloned from `greensock/gsap-skills`.

Global install on Windows:

```powershell
npx skills add https://github.com/greensock/gsap-skills
```

or the marketplace: `/plugin marketplace add greensock/gsap-skills`.

They are **already vendored into this repo** at `.claude/skills/gsap-*`, so they load in any
session opened here without a global install.

Skills: `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`,
`gsap-react`, `gsap-performance`, `gsap-frameworks`.

Note: since Webflow's acquisition, **all GSAP plugins are free**, SplitText and MorphSVG
included — no Club membership, no auth token, no private registry. Install from public `gsap`.

---

## 5. OmniRoute — optional model routing

Verified: package **3.8.50**, `engines: node >=22.22.2 <23 || >=24 <27`. ~450 MB packed.

```powershell
npm i -g omniroute        # server on http://localhost:20128
```

**Your normal `claude` is never touched.** OmniRoute integrates by *spawning* Claude Code with
env injected, not by intercepting it:

```powershell
omniroute launch                    # spawns `claude` with ANTHROPIC_BASE_URL + auth token set
omniroute setup-claude              # writes ~/.claude/profiles/<name>/settings.json
omniroute launch --profile glm52
```

Plain `claude` in any other terminal keeps talking to Anthropic directly. Never set
`ANTHROPIC_BASE_URL` globally / in `setx` — that is the one change that *would* hijack normal
Claude. Keep it per-launch only.

**Keep these OFF.** OmniRoute ships RTK + "Caveman" stacked prompt compression and less-code
steering. That duplicates Ponytail's job and rewrites your context. Compression is settable to
`off` globally, per-API-key from the dashboard, and via `OMNIROUTE_MCP_COMPRESS_DESCRIPTIONS=0`
for MCP schemas. Set compression `off` on first run; let Ponytail own implementation discipline.

Credentials go in OmniRoute's own encrypted store (AES-256-GCM) or its `.env` — never in this
repo, never in CLAUDE.md.

---

## 6. Strix — authorised security testing only

Verified: **1.6.1** (`strix --version`), PyPI package `strix-agent`.

```powershell
uv tool install strix-agent     # or the documented: curl -sSL https://strix.ai/install | bash
strix --version
```

Agent skills (9), global install:

```powershell
npx skills add usestrix/strix
```

They are **already vendored into this repo** at `.claude/skills/`, so they load here already:
`penetration-testing-with-strix`, `web-app-penetration-testing`, `api-security-testing`,
`owasp-top-10-testing`, `find-security-vulnerabilities-in-code`,
`fix-security-vulnerabilities-with-strix`, `ci-security-scanning-with-strix`,
`application-security-testing`, `managed-pentesting-with-strix`.

**Runtime prerequisites, both still needed on Windows:**

1. **Docker running.** First run pulls the sandbox image. Docker Desktop with the WSL2 backend.
2. **An LLM provider key.** A Claude *subscription* is not Anthropic API credit. Strix needs
   `STRIX_LLM` + `LLM_API_KEY` for a supported provider, or the managed cloud
   (`strix cloud ...`, no Docker and no key, but a paid Strix account).

```powershell
$env:STRIX_LLM="anthropic/claude-opus-5"   # example — any supported provider
$env:LLM_API_KEY="..."                     # never commit; never paste into CLAUDE.md
strix --target ./app-directory
```

Results land in `strix_runs/<run-name>` — git-ignored and Claude-ignored here, because reports
contain working proof-of-concept exploits.

**Boundaries.** Your own repos, your own local apps, explicitly authorised staging only. Never
a third-party site. Never client production without written authorisation. Strix never runs as
part of a normal frontend task.

---

## Everyday workflow

```
cd <project>
claude                    # normal. Ponytail lite. Design skills as usual.
```

- Architecture change → `/graphify .`, then `/ponytail`
- Motion work → GSAP skills auto-trigger
- Claude feels inefficient → `codeburn optimize`
- Need another model → `omniroute launch` (deliberate, never default)
- Pre-production → lint · typecheck · test · `pnpm build` · browser QA · visual regression ·
  `pnpm test:a11y` · Lighthouse · Strix on an authorised target · fix · retest · deploy

## Fixing a confirmed vulnerability

Confirm → root cause → `graphify path/explain` for impact radius → smallest robust fix →
preserve UI/UX and unrelated behaviour → retest with Strix → only then call it fixed.
