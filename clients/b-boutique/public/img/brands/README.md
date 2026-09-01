# Brand wordmarks

Drop official SVG wordmarks here, then add `src` to the matching entry in
`src/lib/brands.ts`:

```ts
{ name: "Mos Mosh", src: "/img/brands/mos-mosh.svg", opticalHeight: 26 },
```

The rail picks the file up with no other change. Until `src` is set, that
brand renders a plain typeset stand-in instead.

## Rules

- Official assets only — a brand's own press/media kit, or a public asset the
  brand publishes for this purpose.
- Never redraw, trace, restyle or approximate a trademark. If an official
  asset cannot be obtained, leave the brand without a `src`, or remove it.
- Single-colour SVG. The rail recolours to bone via CSS `mask`, so the source
  should be a clean silhouette with no embedded multicolour fills.
- Strip editor metadata before committing (`svgo` or similar).
- These are placeholders for a client concept and are not confirmed
  stockists. See the header of `src/lib/brands.ts`.
