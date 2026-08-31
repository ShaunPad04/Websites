# frontend-design export markdown format

The single Export button assembles **one** fenced markdown block. The format below is the contract — generated previews must produce exactly this shape, and Claude expects to read exactly this shape when the user pastes it back.

The format is designed to be:
- **Machine-actionable** — Claude can apply changes without re-asking the user
- **Human-scannable** — clear section headings, consistent spacing
- **Order-stable** — same input → same output bytes (so diffs are clean)

---

## Top-level structure

```
## Frontend design round-trip
Source: <relative path to this HTML, from current working directory>
Captured at: <YYYY-MM-DD HH:MM> (local)
Skill: frontend-design
Topic: <topic-slug from filename>

### Decisions          (omit if no decisions changed from defaults)
...

### Direct edits       (omit if no direct text/value edits)
...

### Element comments   (omit if no comments)
...

### Apply
...
```

**Section ordering is mandatory**: Decisions → Direct edits → Element comments → Apply. Do not reorder.

---

## Decisions section

Group decisions by category (Surface, Accents, Typography, Radius, Density, etc.). Use `####` for category subheadings.

For color tokens (have light + dark values):
```
- `<token-name>` (light) → `<chosen-value>`
- `<token-name>` (dark)  → `<chosen-value>`
  - rejected: A(L:<val>/D:<val>), C(L:<val>/D:<val>)
```

For numeric / string tokens:
```
- `<token-name>` → `<chosen-value>`
  - rejected: A(<val>), C(<val>)
```

For slider values, also note the range and step:
```
- `<token-name>` → `<chosen-value>` (slider, range <min>-<max>, step <step>)
```

For segmented / toggle controls:
```
- `<token-name>` → `<chosen-value>` (segmented: A | [B] | C)
- `<flag-name>` → `<true|false>` (toggle)
```

The `rejected` line lists alternatives the user could have picked but didn't. **Only include this line for dropdowns / segmented controls** (where rejected alternatives are meaningful). Sliders are continuous, so no rejected line.

Order within a category: same as displayed in the controls rail.

---

## Direct edits section

Each direct edit is a `####` numbered block. Direct edits are collected from elements decorated with `data-fd-editable` whose value changed from the initial render.

```
#### Edit 1
- Element: `[data-fd-id="<anchor-id>"]` (<human-readable label>)
- Kind: text | value
- Value: <edited value>
```

If the edited value contains multiple lines, indent continuation lines with 2 spaces under the `Value:` line:

```
- Value: First line.
  Second line.
  Third line.
```

`Kind: text` corresponds to `data-fd-editable="text"` (contenteditable text nodes). `Kind: value` corresponds to `data-fd-editable="value"` (form controls — `<input>`, `<textarea>`, `<select>`).

Direct edits represent the user's desired copy/value change, not necessarily the exact source-code storage location. When applying, Claude must route user-facing copy through i18n locale files when the app uses i18n; do not hardcode translated strings into components.

---

## Element comments section

Each comment is a `####` numbered block. Comments are numbered in the order they were created.

```
#### Comment 1
- Element: `[data-fd-id="<anchor-id>"]` (<human-readable label>)
- Scope: this | all-matching | all-like-this | global
- Note: <free-text from the user>
```

For sub-element comments (picker resolved beyond the anchor):
```
#### Comment 2
- Element: `[data-fd-id="<anchor-id>"] > <tag>.<classes>` (descendant of <anchor-label>)
- Scope: this
- Note: ...
```

For comments where no data-fd-id ancestor existed (warning case):
```
#### Comment 3
- Element: `<tag>.<classes>` (warning: no data-fd-id anchor — selector is best-effort)
- Scope: this
- Note: ...
```

For global-scope comments:
```
#### Comment 4
- Element: (global)
- Scope: global
- Note: ...
```

If the comment textarea contains multiple lines, indent continuation lines with 2 spaces under the `Note:` line:
```
- Note: First line of the note.
  Second line continues here.
  Third line.
```

---

## Apply section

Always present. Assembles concrete next-step instructions for Claude:

```
### Apply

When applying these changes:

1. **Token decisions** — write into `<your stylesheet path>` under `:root` (typography/radius/spacing), `.theme-light`, and `.theme-dark` blocks. Components must consume the CSS variables; do not hardcode hex/px values per component.

2. **Direct edits** — locate each edited element via its `data-fd-id` in the corresponding source. Apply value changes to source components, props, fixtures, or locale keys as appropriate. Do not bypass i18n for user-facing copy.

3. **Element comments** — locate each commented element via its `data-fd-id` in the corresponding source. Apply the change as instructed by the Note text. Honor the Scope:
   - `this` → modify only this specific instance
   - `all-matching` → modify the component-level CSS / source so all matching elements get the change
   - `all-like-this` → modify the shared component such that all elements sharing the data-fd-id family pick up the change
   - `global` → modify the global token / theme file

4. **Verify** — build / lint / preview as appropriate for the project. Optionally regenerate the preview HTML to confirm the new state.
```

---

## Worked example

```
## Frontend design round-trip
Source: .frontend-design/dashboard-cards/2026-05-12-v1.html
Captured at: 2026-05-12 14:32 (local)
Skill: frontend-design
Topic: dashboard-cards

### Decisions

#### Accents
- `--accent-warning` (light) → `#ea580c`
- `--accent-warning` (dark)  → `#fb923c`
  - rejected: A(L:#f59e0b/D:#fbbf24), C(L:#d97706/D:#f59e0b)

#### Radius
- `--radius-default` → `10px` (slider, range 0-16, step 2)

#### Density
- `--row-density` → `compact` (segmented: [compact] | normal | spacious)

### Direct edits

#### Edit 1
- Element: `[data-fd-id="wb-title"]` (wb-title)
- Kind: text
- Value: Account overview

### Element comments

#### Comment 1
- Element: `[data-fd-id="node-tasks"]` (Dashboard card — Tasks)
- Scope: this
- Note: Add a 1px inner glow on the left border in the running state to draw the eye to the active card.

#### Comment 2
- Element: `[data-fd-id="node-tasks"] > div.node-foot > span.pill` (descendant of node-tasks)
- Scope: this
- Note: Status pill should sit closer to the left edge — too much horizontal gap right now.

#### Comment 3
- Element: `.node`
- Scope: all-matching
- Note: Tighten vertical padding by 2px across all cards.

#### Comment 4
- Element: (global)
- Scope: global
- Note: All danger-tone pills feel ~10% too saturated. Drop the saturation slightly across light and dark themes.

### Apply

When applying these changes:

1. **Token decisions** — write into `<your stylesheet path>` under `:root` (typography/radius/spacing), `.theme-light`, and `.theme-dark` blocks. Components must consume the CSS variables.

2. **Direct edits**:
   - Edit 1 → update the `wb-title` i18n key in the project's locale files.

3. **Element comments**:
   - Comment 1, 2 → modify the card component for the `tasks` variant in its running state.
   - Comment 3 → modify shared `.node` CSS in the same component file (or its co-located CSS module).
   - Comment 4 → adjust `--status-danger` token globally.

4. **Verify** — build / lint / preview as appropriate. Optionally regenerate the preview HTML.
```

---

## Edge cases

**Empty export** — if the user clicks Export with no decisions changed, no direct edits, and no comments added, show a toast "Nothing to export — change a decision, edit text, or add a comment first" and do not open the modal.

**Decisions only** — omit Direct edits and Element comments sections.

**Direct edits only** — omit Decisions and Element comments sections. The Apply section only mentions direct edits.

**Comments only** — omit Decisions and Direct edits sections. The Apply section only mentions element comments.

**Long free-text notes** — wrap at ~100 chars with hanging-indent continuation. Do not truncate.

**Special chars in note text** — preserve verbatim (no HTML escape, no markdown escape). The user is the source of truth.
