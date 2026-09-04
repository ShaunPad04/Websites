# Uploading the account-sync skills

This is the manual step. Claude Code cannot drive the claude.ai skill-management
UI, so uploading and enabling is yours to do — once. After that the skills follow
your account into every cloud session automatically.

---

## 1. Where the canonical skills live

```
premium-webdev/account-sync-skills/
├── <33 skill folders>
├── CHECKSUMS.txt      per-skill sha256
├── PROVENANCE.csv     machine-readable manifest
└── CREDITS.md         source repo, SHA, derivation, role, exclusions
```

**33 skills · 302 files · 6.5 MB.** This directory is the source of truth. Edit
here, never in an uploaded copy.

## 2. Package them

```bash
cd premium-webdev
bash scripts/package-account-sync-skills.sh
```

Produces, in `dist/` (gitignored — derived, never committed):

- `dist/zips/<skill>.tar.gz` — one archive per skill
- `dist/account-sync-skills.tar.gz` — all 33 combined

Archives are **reproducible**: fixed mtime, fixed owner, sorted entries, no gzip
timestamp. The same input gives byte-identical output on any machine, so you can
compare hashes across time and machines.

Verify the source before packaging:
```bash
bash scripts/package-account-sync-skills.sh --verify
# → all 33 skills verified
```

## 3. Upload

Go to **claude.ai → skill settings**, or **Customize** in the Claude Desktop app
sidebar. Upload each skill (one folder / one archive per skill).

Upload the **whole folder**, not just `SKILL.md`. Several skills are useless
without their payload:

| Skill | Must include |
|---|---|
| `ui-ux-pro-max` | `scripts/*.py` + `data/*.csv` (47 files) — the search engine and its databases |
| `apple-design-hig` | 57 files of HIG reference |
| `design-libera` | 35 files of methodology |
| `website-rebuild`, `local-business-rebuild`, `design-system-generator` | embedded `design-references/` |
| `theme-factory` | 21 files |
| `brand`, `design-system`, `graphify`, `tailwind-ui-rules` | multi-file references |

Account sync supports multi-file skills — the first-party `docx` skill syncs as
61 files. Nothing here needs flattening.

## 4. Enable them for your account

Uploading is not enough. **Each skill must be enabled for your account.**

Per the docs: *"Cowork and cloud sessions load the skills enabled for your
claude.ai account, synced at session start."* Enabling is what makes them follow
you into every cloud project.

## 5. Verify in a fresh cloud session

Start a **new** Claude Code cloud session, then:

```bash
ls ~/.claude/skills/synced/*/
```

Expect your 33 alongside the first-party ones. Spot-check the payload survived:

```bash
S=$(find ~/.claude/skills/synced -maxdepth 2 -name ui-ux-pro-max)
find "$S" -type f | wc -l          # expect 47
python3 "$S/scripts/validate_data.py"
# → OK: validated 12 domain files, 22 stack files, and ui-reasoning.csv
```

If that last command prints the OK line, the full data payload made the trip.

## 6. Why some skills will not appear under `/`

Expected, not a fault. Five carry `disable-model-invocation: true`
(`visual-preview`, `full-output-enforcement`, `image-to-code`,
`redesign-existing-projects`, `imagegen-frontend-web`) so they never fire
automatically during ordinary work.

Reference skills (`ui-ux-pro-max`, `design-libera`, `apple-design-hig`,
`tailwind-ui-rules`, `high-end-visual-design`, `emil-design-eng`,
`web-design-guidelines`) are deliberately consulted rather than invoked.

**Capability matters more than slash-menu visibility.** Frontmatter was not
altered to make skills appear in the menu.

Two further notes on synced-skill behaviour:

- Claude Code **skips a synced skill whose name matches a built-in command**, and
  a project `.claude/skills/` skill of the same name **overrides** the synced one.
  That is why the stale duplicates were removed from this repo's `.claude/skills/`.
- Claude Code **never executes dynamic context injection** in a synced skill.
  `tailwind-ui-rules` was rewritten accordingly — see `CREDITS.md`.

## 7. Validate later

```bash
cd premium-webdev
bash scripts/package-account-sync-skills.sh --verify
```

Checks every skill against `CHECKSUMS.txt`. After editing a skill, refresh with:

```bash
bash scripts/package-account-sync-skills.sh --checksums
```

Then re-package and re-upload only what changed.

---

## Updating a skill later

1. Edit in `account-sync-skills/<skill>/`
2. `--checksums` to refresh hashes
3. Update the row in `CREDITS.md` (source, SHA, derivation)
4. Commit
5. Re-package and re-upload that skill
6. Re-enable if the UI requires it
