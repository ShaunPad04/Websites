/** ⚠ DEVELOPMENT PLACEHOLDERS — NOT CUSTOMER CONTENT ⚠
 *
 *  B Boutique has no reviews. The shop has not opened, so there are no
 *  customers to have written any, and none exist anywhere in this project —
 *  searched before writing this file.
 *
 *  Every quote below is a marker in shouting caps precisely so it cannot be
 *  mistaken for a real one, in code or on screen. Writing plausible-sounding
 *  quotes here would have produced fabricated customer testimony sitting in a
 *  real business's repository, one commit away from being published as fact.
 *
 *  THIS SECTION IS NOT FIT TO SHIP until every entry is replaced with a
 *  genuine review, its real author, and its real source. `pending: true` is
 *  what the component reads to render the visible internal marker; delete it
 *  from an entry once that entry is real.
 *
 *  Ratings are deliberately absent rather than defaulted to five stars. A
 *  rating is a factual claim about what someone said; inventing one is the
 *  same class of error as inventing the sentence. Add `rating` per entry when
 *  the real reviews arrive and the stars appear on their own.
 *
 *  ── About the photographs ────────────────────────────────────────────────
 *  Deliberately the boutique's own room — rails, shelves, marble, brass — and
 *  NOT a portrait. A face beside a named quote reads as the person who said
 *  it, and there are no customer photographs. Keep it that way when the real
 *  reviews land: the shop is the illustration, not an invented customer. */
export type Testimonial = {
  quote: string;
  name: string;
  source: string;
  /** Slot key for the accompanying boutique photograph. */
  slot: string;
  alt: string;
  /** Star rating, 1-5. Absent means no rating is known — show no stars. */
  rating?: number;
  /** True while this is a placeholder rather than a real review. */
  pending?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote: "REPLACE WITH GENUINE B BOUTIQUE REVIEW",
    name: "CUSTOMER NAME",
    source: "REVIEW SOURCE",
    slot: "panel-all",
    alt: "A rail of womenswear against the boutique's black marble wall",
    pending: true,
  },
  {
    quote: "REPLACE WITH GENUINE B BOUTIQUE REVIEW",
    name: "CUSTOMER NAME",
    source: "REVIEW SOURCE",
    slot: "panel-knitwear",
    alt: "Folded knitwear on a brass and smoked-glass shelf in the boutique",
    pending: true,
  },
  {
    quote: "REPLACE WITH GENUINE B BOUTIQUE REVIEW",
    name: "CUSTOMER NAME",
    source: "REVIEW SOURCE",
    slot: "panel-trousers",
    alt: "Tailored trousers hanging on a polished brass rail in the boutique",
    pending: true,
  },
];

/** True while any entry is still a placeholder. The component uses this to
 *  show the internal marker, and it is the one thing to check before launch. */
export const testimonialsPending = testimonials.some((t) => t.pending);
