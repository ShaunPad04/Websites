import { formatHour, hours, shop } from "./shop";

/** Questions for the homepage FAQ.
 *
 *  ─────────────────────────────────────────────────────────────────────────
 *  RULE: nothing in here may state a policy the client has not confirmed.
 *
 *  A returns window, a delivery charge or a gift-card term invented to fill a
 *  gap is not placeholder copy — published on a real shop's site it is a
 *  promise the shop then has to honour. So an answer either comes from
 *  confirmed data in this repository, or it carries a `pending` marker that
 *  is impossible to miss in review.
 *  ─────────────────────────────────────────────────────────────────────────
 */
export type FaqItem = {
  q: string;
  /** Confirmed prose. Safe to publish. */
  a?: string;
  /** Unconfirmed. Rendered as a visible internal marker, never as fact. */
  pending?: string;
};

/** Derived from `hours` rather than written out, so the answer cannot drift
 *  away from the hours table and the "open now" badge further down the page. */
function openingSummary(): string {
  const open = hours.filter((d) => d.hours);
  const closed = hours.filter((d) => !d.hours);
  if (open.length === 0) return "";

  const first = open[0].hours!;
  const uniform = open.every(
    (d) => d.hours!.open === first.open && d.hours!.close === first.close,
  );
  const span =
    open.length > 1 && uniform
      ? `${open[0].day} to ${open[open.length - 1].day}`
      : open.map((d) => d.day).join(", ");
  const time = `${formatHour(first.open)} — ${formatHour(first.close)}`;
  const shut =
    closed.length === 0
      ? ""
      : ` Closed ${closed.map((d) => d.day).join(" and ")}.`;

  return uniform ? `${span}, ${time}.${shut}` : `${shut}`;
}

export const faq: FaqItem[] = [
  {
    q: "Where is B Boutique?",
    /* The address only. The wayfinding sentence that used to follow it —
       "Sea View Street runs up from the seafront, there is on-street parking
       at the top, and the Market Place car park is a two-minute walk" — was
       never confirmed by anyone. Parking availability, a car park's name and
       a walking time are all checkable claims a customer would act on, and
       confirming the address did not confirm any of them.
       Removed rather than hedged: "there may be parking nearby" is still an
       assertion, just a vaguer one. Nothing replaces it.
       The whole sentence went, not only the parking half — "runs up from the
       seafront" came from the same unverified source, and clipping the clause
       would have left a fragment of it standing as fact.
       Restore it, in the client's own words, if and when they confirm it. */
    a: `${shop.street}, ${shop.town} ${shop.postcode}.`,
  },
  {
    q: "What are your opening hours?",
    a: openingSummary(),
  },
  {
    q: "Do you offer delivery?",
    pending: "CLIENT TO CONFIRM DELIVERY POLICY",
  },
  {
    q: "Can I return or exchange an item?",
    pending: "CLIENT TO CONFIRM RETURNS AND EXCHANGES POLICY",
  },
  {
    q: "Do you offer gift cards?",
    pending: "CLIENT TO CONFIRM GIFT CARD AVAILABILITY AND TERMS",
  },
  {
    q: "Can I reserve an item?",
    pending: "CLIENT TO CONFIRM RESERVATION POLICY",
  },
  {
    q: "Do you sell online as well as in store?",
    a: "B Boutique is a shop you walk into. Everything on the rails is chosen by hand and sold in store.",
    pending: "CLIENT TO CONFIRM WHETHER ONLINE ORDERING IS PLANNED",
  },
  {
    q: "How can I contact the boutique?",
    a: `Come in to ${shop.street}, ${shop.town}, during opening hours.`,
    // shop.phone and shop.email are deliberately empty in shop.ts — a wrong
    // number on a real shop's site sends customers to a stranger.
    pending: shop.phone && shop.email ? undefined : "CLIENT TO CONFIRM PHONE NUMBER AND EMAIL",
  },
];
