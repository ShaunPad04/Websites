# Product

## Register

brand

## Users

Women in and around Cleethorpes and North East Lincolnshire who buy clothes in
person, and visitors to the seafront who walk Sea View Street. They arrive on a
phone, usually before deciding whether the trip is worth making, and they are
answering three practical questions: what kind of shop is this, is it open, and
where exactly is it.

There is no account, no basket and no returning-user state. Every visitor is
effectively a first-time visitor, and the site has one job for all of them.

The job to be done is **deciding to walk through the door.** The site is not a
storefront; it is the thing that happens before the storefront.

## Product Purpose

B Boutique is an independent womenswear, accessories and homeware boutique at
18 Sea View Street, Cleethorpes, DN35 8EZ. It is open Tuesday to Sunday, 10am
to 4pm, and closed Monday. The shop sells in person only.

This site is a single scroll-driven page whose conversion is a postcode, not a
checkout. Success is a visit: someone reads the page, understands the taste of
the place, and goes. Every structural decision follows from that — prices are
deliberately absent because stock turns faster than a website does, category
links point at the Visit section because the clothes can only be seen in the
shop, and the page ends on an address and a map rather than a call to action to
buy.

The commercial consequence of getting this wrong is unusual and worth stating:
this is a **real business at a real address**. A confident-sounding invention
about opening hours, delivery, parking or stockists does not merely embarrass
the site, it sends a real person to a real door on wrong information. That
asymmetry drives the first design principle below.

## Brand Personality

Assured, cool and unfussy. A fashion gallery rather than a jewellery box.

The voice is plain-spoken and specific. It says "Wide, tailored, and cut to
actually fit" and "For a street that faces the sea" — concrete, faintly dry,
never breathless. It does not use luxury adjectives to manufacture prestige,
and it never oversells. Where a fact is not known, the site says so or says
nothing; it does not fill the gap with warmth.

Three words: **assured, cool, exact.**

Emotionally the page should feel like a well-lit room with good things in it
and nobody hovering. Confidence without pressure.

## Anti-references

These are recorded because the implementation argued each one out explicitly,
not because they are generic good taste.

- **The default boutique website.** Playfair Display plus Montserrat, cream and
  champagne, a gold-foil monogram. This is the first thing anyone produces for
  "luxury boutique" and it is precisely what this site rejects.
- **Warm luxury signifiers.** No brown, tan, beige, cream, champagne or gold in
  the UI. The original palette was drawn from the shop's own black marble and
  brass and it read brown wherever two surfaces met; the approved direction is
  a cool fashion-gallery white against a true black. The only warm colour on
  the site comes out of the hero photograph itself, where it is real.
- **Faked commerce.** No cart state, no checkout, no search backend, no
  invented stock counts. SEARCH and BAG (0) exist as inert, `aria-hidden`
  marks because they are part of the approved header composition and nothing
  more. Never simulate a transaction the shop cannot honour.
- **Invented local fact.** No parking claims, walking times, car park names,
  street rules, delivery terms, returns policy or stockist relationships until
  the client confirms them in their own words. Placeholder content must
  announce itself as placeholder.
- **Motion for its own sake.** No scroll hijacking, no animation on every
  heading, no pinning that delays the page. One heroic effect per screen.

## Design Principles

**1. Never assert what the client has not confirmed.**
The strongest rule on the project. Unverified claims are removed, not softened;
placeholders are labelled in-source and on-screen; indexing is default-deny so
an unapproved answer cannot reach Google attached to a real business. Silence
beats a plausible guess.

**2. One source of truth, or none.**
The address, hours and coordinates live in `shop.ts` and every consumer derives
from it — Visit, the FAQ, the footer, the menu, the JSON-LD, the map, the
directions link. There is no second copy to keep in step. When two sources
would have to agree, there is only one source.

**3. The ask is a visit, not a basket.**
The page is built to end at an address. Anything that implies online purchase
is a false promise, and anything that delays someone reaching the postcode is
working against the only conversion that exists.

**4. Restraint is the luxury signal.**
Expense reads through proportion, contrast and space, not through ornament.
Two typefaces. One easing curve. Three durations. A single warm colour, and it
comes from a photograph. When a decision could go louder or quieter, it goes
quieter — and then commits completely to the few moves it keeps.

**5. Decisions are recorded with their reasoning.**
The codebase argues with itself in comments so that a settled question stays
settled. A decision without its reason gets re-opened by the next person and
re-broken. Locked decisions live in `CLAUDE.md` and are not revisited without
the client asking.

## Accessibility & Inclusion

WCAG 2.1 **AA is the floor, not the goal.** The project ships an automated gate
(`pnpm test:a11y`, Playwright plus axe-core) that runs at mobile, tablet and
desktop and must pass with zero violations, including a keyboard-navigation
check at each width.

Specific commitments already implemented and not to be regressed:

- **Contrast is measured, not assumed.** Each grey is documented as safe on
  exactly one ground: `--bb-grey-mid` is a dark-section colour (6.95:1 on
  black, failing 2.68:1 on white), `--bb-grey-dark` a light-section one
  (5.44:1 on white). They are not interchangeable.
- **Focus is never removed.** The ring is `currentColor` at 2px with 3px
  offset, because the same ring crosses a black header, a photograph, a
  cool-white FAQ and a black footer, and no fixed colour survives all four.
- **`prefers-reduced-motion` is honoured globally**, not per component:
  reveals resolve to their finished state, smooth scrolling reverts to auto,
  and animation and transition durations collapse.
- **Interaction works without JavaScript where it can.** The rails use native
  CSS scroll-snap so they remain keyboard and screen-reader navigable.
- **Dead controls are not announced.** Inert marks are `aria-hidden` rather
  than presented to assistive technology as operable controls.

<!-- Provenance: this file was assembled from the existing implementation and
     CLAUDE.md, not from an interview. Facts (address, hours, register,
     accessibility behaviours, anti-references) are evidenced in source. The
     three-word personality and the emotional goal in Brand Personality are
     the one inferred reading and are the parts most worth a client sanity
     check. -->
