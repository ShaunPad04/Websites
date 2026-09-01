# Brand wordmarks

Official assets only, used as supplied. Never redraw, trace, restyle, crop or
approximate a trademark. If an official asset cannot be obtained, leave the
brand out rather than inventing its mark.

These are placeholders for a client concept and are **not confirmed
stockists** — see the header of `src/lib/brands.ts`.

## Adding or replacing one

1. Drop the file in here. **Name it for what it actually is**, not for what
   you expected: run `file` or check `sharp().metadata().format`. One asset
   arrived as WebP named `.png`, which renders (browsers sniff) but is served
   with the wrong Content-Type and can fail on a stricter host or CDN.

2. Measure it. The rail sizes marks from their **ink**, not their file box,
   because the two are rarely the same — supplied assets have carried
   anything from 0% to 73% transparent padding, some of it off-centre:

   ```bash
   node -e "
   const sharp=require('sharp');
   (async()=>{
     const p='public/img/brands/YOUR-FILE';
     const buf=await sharp(p,{density:900}).resize({height:600,fit:'inside'}).png().toBuffer();
     const d=await sharp(buf).metadata();
     const t=await sharp(buf).trim({threshold:1}).toBuffer({resolveWithObject:true});
     const i=t.info, H=i.height, L=-i.trimOffsetLeft, T=-i.trimOffsetTop;
     console.log({iw:+(i.width/H).toFixed(4), mw:+(d.width/H).toFixed(4),
                  mh:+(d.height/H).toFixed(4), ox:+(L/H).toFixed(4), oy:+(T/H).toFixed(4)});
   })();"
   ```

3. Put those five numbers into the brand's entry in `src/lib/brands.ts`
   alongside its `src`. They are the mask's scale and offset; the component
   needs nothing else.

4. Set `cap` — the ink height in px — **by looking at the rendered row**, not
   by formula. Equal ink height is not equal optical weight: the heavy bolds
   (MOS MOSH, ICHI) sit at 22 while the thin serifs sit at 24–26, and Saint
   Tropez stacks two lines so it needs 32. Screenshot the rail and judge it.

## Asset requirements

- Transparency is required. The rail recolours to `--bone` with a CSS mask,
  which reads the alpha channel — an opaque background masks as a solid
  block. Verify `alpha min/max` spans 0–255.
- Single colour. Multicolour fills are flattened by the mask anyway.
- Prefer SVG. Strip editor metadata before committing (`svgo` or similar).
