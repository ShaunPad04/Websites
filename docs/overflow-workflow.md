# Overflow Workflow — validated Codespaces lane

**Status: proof-of-concept validated.** This is an optional overflow lane for routine implementation when hosted Claude is unavailable or capped. It does **not** change the normal premium-webdev workflow. **Opus 5 remains the creative director and final authority.**

---

## 1. Hierarchy

### Opus 5 = Creative Director (exclusive authority)

Opus, and only Opus, owns decisions that affect how the site **looks or feels**:

- brand direction
- visual design
- UI / UX
- typography
- colour system
- layout composition
- hero design
- motion direction
- GSAP choreography
- animation timing / easing
- design tokens
- premium responsive decisions
- final visual QA
- merge approval

### Overflow model = Implementer only

The overflow model may carry out work Opus has already decided and specified:

- approved component implementation
- TypeScript fixes
- tests
- accessibility fixes
- refactors
- content / copy swaps
- repetitive engineering
- straightforward implementation explicitly specified by Opus

### Hard rule

> **If a decision changes how the website LOOKS or FEELS, the overflow model does NOT decide it.**

The overflow model must never independently redesign, simplify approved visual work, change typography or colours, alter design tokens, remove premium interactions, change GSAP choreography, invent timing/easing, alter hero composition, reinterpret responsive art direction, or replace sophisticated approved UI with generic components.

> **If an approved specification is ambiguous: STOP AND REPORT. DO NOT IMPROVISE.**

Ambiguity is not permission. A missing value is a question for Opus, never a choice for the implementer.

The implementer must obey the repository guidance, including `CLAUDE.md`, premium motion guidance, responsive/Tailwind rules, GSAP skills where relevant, and the rule that implementation simplification never overrides intentional art direction.

---

## 2. Architecture

```text
NORMAL (Claude available)
  Opus 5
    -> designs / art-directs
    -> writes an approved implementation spec
    -> reviews the implementation
    -> performs final visual QA
    -> approves merge

OVERFLOW / POST-CAP
  Browser
    -> GitHub Codespaces
    -> Cline
    -> OmniRoute on 127.0.0.1:20128
    -> Gemini 3.7 Flash (validation worker)
    -> same premium-webdev repository
```

Opus and the overflow lane coordinate through GitHub/repository state, not through a live socket between hosted Claude and the Codespace.

---

## 3. Current validated model

The working validation route is:

```text
Cline -> OmniRoute -> gemini/gemini-3.7-flash
```

`gemini-2.5-pro` was tested and rejected by the upstream API as unavailable for this account. The working model is therefore pinned in the overflow helper to:

```text
gemini-3.7-flash
```

Model catalogues change. Check the current connected catalogue with:

```bash
omniroute models
```

This free Gemini route is **validation / non-sensitive work only unless current Google API terms for the exact account and client use case have been reviewed and approved**. Do not route real confidential client code through an unverified free provider.

The later client-safe worker can be swapped behind OmniRoute without changing Cline, Codespaces, or the repository workflow.

---

## 4. Secrets

Provider credentials live only in **GitHub Codespaces Secrets** and are injected as environment variables. They must never appear in git, `CLAUDE.md`, committed `.env` files, documentation, screenshots, logs, or shell history.

Current required secret:

```text
GEMINI_API_KEY
```

It is scoped to the `ShaunPad04/premium-webdev` repository.

To rotate it: GitHub -> Settings -> Codespaces -> Secrets, update the secret, then stop and restart the Codespace so the new value is injected.

Never paste the provider key into Cline. Cline talks only to OmniRoute.

---

## 5. Starting the overflow lane

The devcontainer installs OmniRoute but deliberately does not auto-start it.

After opening or rebuilding the Codespace, run:

```bash
bash scripts/start-overflow.sh
```

The helper:

1. requires `GEMINI_API_KEY` to exist;
2. keeps `OMNIROUTE_SERVER_HOST=127.0.0.1`;
3. configures/updates the native `gemini` provider from the environment without putting the secret in argv or shell history;
4. sets the default worker model to `gemini-3.7-flash`;
5. starts OmniRoute on port `20128` if needed;
6. verifies that a loopback listener exists before reporting success;
7. prints the exact Cline values to use.

Port `20128` must remain private and must never be publicly forwarded.

---

## 6. Cline configuration

Use **OpenAI Compatible** in Cline with exactly:

```text
API Provider: OpenAI Compatible
Base URL:     http://127.0.0.1:20128
API Key:      sk_omniroute
Model ID:     gemini/gemini-3.7-flash
```

### Important: no `/v1` in the Base URL

Do **not** enter:

```text
http://127.0.0.1:20128/v1
```

Cline appends the OpenAI-compatible path itself. The validated working Base URL is:

```text
http://127.0.0.1:20128
```

`sk_omniroute` is the local Cline-to-OmniRoute value used by this setup. It is **not** the Google provider key.

---

## 7. Validation completed

The end-to-end proof completed successfully:

1. Cline reached OmniRoute locally.
2. OmniRoute authenticated to the Gemini provider.
3. `gemini/gemini-3.7-flash` returned a successful response.
4. Cline proposed a controlled repository edit.
5. The model was corrected when it substituted a Unicode arrow for the exact ASCII spec.
6. It then created exactly one test file with the requested content.
7. `git status --short` showed only that one untracked test file.
8. The test file was deleted.
9. `git status --short` returned clean.

This proves the overflow lane can perform controlled implementation work without hosted Claude.

---

## 8. Safe task contract

For any real overflow task, provide an **Opus-approved implementation spec** and include these constraints:

- implement only the approved specification;
- do not make independent visual/design decisions;
- do not alter typography, colours, spacing, motion direction, choreography, responsive art direction, or design tokens unless the spec explicitly says to;
- do not simplify intentional premium interactions;
- if any visual requirement is missing or ambiguous, stop and report instead of guessing;
- inspect only files required for the task;
- do not commit or push unless explicitly instructed;
- report every file changed and every command run.

A useful implementation handoff format is:

```text
ROLE: implementation worker only. Opus 5 owns design decisions.

APPROVED SPEC:
<exact Opus-approved implementation instructions>

BOUNDARIES:
- No redesigning or visual improvisation.
- No changes outside the named files unless required and reported first.
- Ambiguity = STOP AND REPORT.
- Run the requested verification commands.
- Do not commit or push unless explicitly instructed.

DELIVERABLE:
- implementation
- verification results
- exact changed-file list
- any unresolved ambiguity
```

---

## 9. £0 guardrails

- Keep the GitHub Codespaces spending budget at **$0**.
- Use the 2-core Codespace where practical.
- Stop the Codespace when finished.
- Keep port `20128` private.
- Do not attach a paid provider during the £0 validation phase unless intentionally upgrading the worker.
- Free-provider availability and rate limits can change; temporary `503 high demand` responses are possible.

---

## 10. Scope

### Infrastructure/setup work

May edit only overflow infrastructure such as:

- `.devcontainer/devcontainer.json`
- `docs/overflow-workflow.md`
- `scripts/start-overflow.sh`

It must not alter B Boutique application source, the design system, existing skills, or `CLAUDE.md` merely to set up the lane.

### Approved overflow implementation work

The worker may edit B Boutique application code **only under an explicit Opus-approved implementation spec**. It remains an implementer, not an art director.
