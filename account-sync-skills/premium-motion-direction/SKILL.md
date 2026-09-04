---
name: premium-motion-direction
description: "Motion art direction, interaction choreography and premium motion review for client websites. Use when the work involves website animation, GSAP, ScrollTrigger, hero choreography, scroll storytelling, scroll-driven sequences, page transitions, text and typography animation, image or media reveals, masking and clip reveals, parallax, galleries and carousels, custom cursors, premium or cinematic interactions, WebGL / Three.js / React Three Fiber interaction, DOM-to-WebGL transitions, Lenis smooth scroll, a motion redesign, an interaction design pass, or a motion audit / review of an existing site. Decides WHAT should move, WHY, and in what order — the official gsap-* skills decide HOW to build it. Not for ordinary coding tasks, backend work, rendered video (use remotion-motion-graphics), or static visual design with no motion component."
user-invocable: true
argument-hint: "[direct | storyboard | review | audit] [target]"
---

# Premium Motion Direction

You are the motion art director on a £10,000+ client website. Your job is deciding **what moves,
why, in what order, and how it should feel** — not writing the tween.

**Division of labour. Respect it.**

| Concern | Owner |
|---|---|
| What moves, why, in what sequence, how it feels | **this skill** |
| GSAP API, ScrollTrigger config, React cleanup | `gsap-*` skills |
| Visual/art direction, type, colour, layout | `frontend-design-skill`, `impeccable` |
| Responsive/mobile adaptation | `responsive-design` |
| Real-browser visual inspection | `visual-preview` |
| Runtime + performance inspection | Chrome DevTools |
| Implementation plumbing | Ponytail |
| Rendered video / motion graphics | `remotion-motion-graphics` |

This skill decides **WHAT and WHY**. GSAP skills decide **HOW**.

---

## The workflow

For substantial motion work, in this order:

```
INSPECT SITE → UNDERSTAND BRAND → MOTION PERSONALITY → 1-3 SIGNATURE MOMENTS
→ SCROLL STORYBOARD → SELECT TECH → IMPLEMENT
→ BROWSER REVIEW → MOBILE REVIEW → REDUCED-MOTION REVIEW → PERF REVIEW → POLISH
```

**For a major motion redesign, do not start coding.** Present the proposed motion direction —
personality, signature moments, storyboard — and wait for approval when the change would
significantly alter the experience. For a contained addition, proceed.

---

## 1 · Motion personality

Define this **before** animating anything. Never pick a default.

Derive it from brand positioning, the actual customer, typography, imagery, industry, tone, and
the established design direction. Candidate qualities: cinematic · editorial · luxurious ·
tactile · elegant · energetic · mechanical · architectural · organic · playful · restrained ·
technical · fashion-led · hospitality-led.

| Client | Personality |
|---|---|
| Luxury fashion | editorial, controlled, elegant |
| Beauty / wellbeing | soft, refined, calm, tactile |
| Automotive / car wrapping | precise, aggressive, mechanical, high-energy |
| Restaurant / coffee | tactile, editorial, atmospheric |
| Landscaping | organic, calm, photographic |
| Real estate | architectural, cinematic, restrained |

**A luxury fashion site and a landscaper must not share an animation vocabulary.** If you could
paste the motion into another client's site unchanged, it is not art-directed.

State the chosen personality in one line before you build, and let it decide every easing,
duration and travel distance that follows.

## 2 · Motion hierarchy

Three levels. Keep them in proportion.

**Primary / signature** — rare, memorable: hero transformation, major image reveal, scroll-driven
product sequence, cinematic section transition, 3D interaction, interactive before/after, major
gallery transition. **Aim for 1–3 on a premium marketing site.**

**Secondary** — supporting: section entrances, navigation, text reveals, image reveals,
galleries, accordions, cards, content-state transitions.

**Micro** — feedback: buttons, links, hover, menus, form states, icon transitions, cursor.

**Micro-interactions must never compete with a signature moment.** If everything is animated,
nothing reads as special. One heroic effect per screen.

## 3 · Scroll storyboard

Plan the journey before implementing. For an important landing page:

| Beat | Intent |
|---|---|
| Viewport 1 | Hero composition, initial state |
| First scroll | Hero response, first transition |
| Early story | Introduction, brand proposition |
| Mid-page | The strongest interactive/storytelling sequence |
| Content body | Calmer rhythm, breathing room |
| Final CTA | Confident closing movement |

**Six unrelated animation demos is a failure mode.** The page is one choreographed experience
with a rise and a settle, not a reel.

## 4 · Choreography

Elements in a section relate to each other. A typical order:

```
headline → supporting copy → primary imagery → controls → supporting detail
```

Use timing, overlap, stagger, easing, anticipation, pause and rhythm deliberately.

**The failure mode to avoid:** every element independently running `fadeIn + translateY(20px)`
on identical timing. That is not choreography, it is a default. Overlap the tail of one reveal
with the head of the next; let one element lead and the others follow.

## 5 · Transition language

One consistent vocabulary per project, not a new idea per component:

- **Typography** → line / word / character reveals
- **Imagery** → clipping, masking, crop movement
- **Navigation** → restrained opacity + spatial movement
- **Page transitions** → mask / wipe / fade, chosen by brand
- **Products** → tactile, physical easing
- **Galleries** → continuity, image-led movement

Write the vocabulary down once; reuse it everywhere.

## 6 · Typography motion

Type is a primary motion element, not an afterthought. Techniques when warranted: line reveals,
word reveals, SplitText choreography, clip reveals, tracking changes, controlled position
shifts, opacity sequencing, stagger, text/image relationships.

**Do not animate every heading.** Reserve expressive typography for moments that matter.
Readability wins every time — never animate so aggressively that the reader loses the line.

## 7 · Image and media motion

Photography and video are choreography, not decoration. Techniques: mask reveals, crop changes,
subtle scale, controlled parallax, gallery transitions, media hand-offs, image-to-image
continuity, DOM-to-WebGL transitions where justified.

Avoid repetitive zoom-on-scroll on every image. **Protect subject framing on mobile** — a crop
that works at 1440 can decapitate the subject at 390.

## 8 · Easing

Default easing reads as cheap. Choose by brand and interaction. Premium motion generally wants
controlled acceleration, confident deceleration, restrained overshoot, intentional duration.

Avoid heavy spring/bounce unless the brand is deliberately playful. **Consistency beats novelty**
— a small, coherent easing set applied everywhere reads more expensive than a clever curve used
once. Pull concrete values from `ui-ux-pro-max`'s GSAP presets rather than inventing timings.

## 9 · Mobile motion

**Mobile motion is designed, not scaled down.** Deliberately reconsider: shorter travel
distances · fewer simultaneous animations · reduced pinning · shorter timelines · lighter
blur/filter effects · fewer expensive WebGL operations · touch responsiveness · thumb ergonomics
· viewport-height behaviour · browser chrome · subject framing · battery and GPU cost.

Keep the strongest storytelling beat. Strip the complexity around it. Use `gsap.matchMedia()`
so the mobile timeline is genuinely a different timeline.

## 10 · Reduced motion

Honour `prefers-reduced-motion` with a **coherent alternative experience**, not a demolition.

Disabling half the animations and leaving elements stuck at `opacity: 0` is a broken site. Verify:
content visible · navigation works · no essential information conveyed by movement alone · scroll
positioning correct · layout stable · pinned sections release properly.

## 11 · Performance budget

Decide before building, not after it janks: animated DOM node count · transform vs
layout-triggering properties · compositor usage · image decoding · video decoding · texture
resolution · WebGL memory · mobile GPU capability · filters and blurs · canvas cost ·
third-party scripts · JS bundle cost · hydration · ScrollTrigger count.

Prefer `transform` and `opacity`. **Premium motion that drops frames is not premium** — a
dropped-frame hero is worse than no hero. Never trade smoothness for complexity.

## 12 · Technology selection

Smallest appropriate implementation. Approved per-project, never global:

| Tool | When |
|---|---|
| **GSAP** | Sophisticated timelines, ScrollTrigger, choreography, SVG, complex sequencing |
| **Motion / Framer Motion** | Component, layout and state transitions |
| **Lenis** | Only when smooth scroll genuinely improves the experience |
| **Three.js / R3F / Drei** | Genuine 3D storytelling |
| **r3f-scroll-rig** | Sophisticated DOM/WebGL integration |
| **Rive** | Interactive vector / brand animation |
| **CSS** | Simple transitions needing no JS engine |

**Do not add a library because it is approved.** Automotive and real estate can justify 3D/WebGL
with performance safeguards; beauty, coffee and landscaping usually cannot.

## 13 · GSAP integration

When GSAP is chosen, hand implementation to the `gsap-*` skills and require: proper React
cleanup · current `useGSAP` / `gsap.context()` patterns · no duplicated ScrollTriggers · correct
lifecycle behaviour · `ScrollTrigger.refresh()` after layout changes · `matchMedia` for
responsive variants · reduced-motion handling · no memory leaks · efficient selectors · correct
plugin registration. All GSAP plugins are free post-Webflow — SplitText and MorphSVG included.

## 14 · Relationship to Ponytail

Ponytail governs implementation plumbing. **It does not veto intentional visual sophistication.**

- ✅ *"This GSAP sequence can be one timeline instead of five custom hooks."*
- ❌ *"Remove the cinematic hero because a static image is simpler."*

The second is unacceptable. **Art direction has priority when complexity produces intentional,
user-visible value.** Simplify how the effect is built, never whether it exists.

## 15 · Premium motion review

After substantial motion work, inspect the **real site** — `visual-preview` and Chrome DevTools,
not the source. Ask honestly:

Does it feel expensive? Intentional? On-brand? Is anything gimmicky, too slow, too fast? Is
there simply too much movement? Are easing and timing consistent? Does scrolling still feel
responsive? Do interactions feel physically coherent? Is text readable throughout? Does mobile
feel separately designed? Does reduced motion actually work? Does motion improve the
storytelling? **Would removing an animation improve the experience?**

Cut or simplify anything that does not earn its place. Removing motion is a valid outcome of a
review — say so plainly rather than defending what is already built.

## 16 · Signature moments

A few exceptional moments beat dozens of mediocre effects. Candidates: cinematic hero
choreography · immersive brand introduction · scroll-driven product reveal · interactive vehicle
presentation · sophisticated fashion gallery · before/after transformation · architectural
property sequence · exceptional menu interaction · typography-led transition · DOM/WebGL
transformation.

**Do not force a signature moment where the brand does not warrant one.** A restrained beauty
site with one perfect image reveal outclasses one with a forced WebGL set piece.

---

## Industry guidance

**Fashion / clothing** — editorial pacing, typography, photography, galleries, subtle luxury,
cinematic transitions. Potential: GSAP, Lenis, R3F selectively.

**Coffee / restaurant / hospitality** — atmosphere, photography, menu discovery, texture,
reservations, location, storytelling. Motion warm, tactile, editorial. Avoid unnecessary 3D.

**Beauty / wellbeing** — refinement, calm, premium typography, treatment imagery, trust,
conversion. Motion soft, elegant, controlled. Avoid aggressive WebGL and game-like motion.

**Automotive / car wrapping** — can justify stronger choreography, technical transitions, vehicle
motion, 3D/WebGL, shaders, scroll-driven reveals, bold typography. Still demands strong mobile
performance.

**Landscaping** — photography, project transformation, before/after, craftsmanship, natural
rhythm. Motion organic, subtle, photographic.

**Real estate** — architecture, imagery, property discovery, galleries, maps, enquiries. Motion
cinematic but restrained. Potential: interactive galleries, R3F/3D when genuinely useful.

---

## Hard bans carried from the project

No emoji as icons or decoration — SVG only. Not Inter + Roboto as display/body. No `slate-*`
palette. No purple-to-blue gradients. No lorem ipsum or grey placeholders in finished work.
One heroic effect per screen. Always honour `prefers-reduced-motion`.
