import { shop } from "./shop";

export type MenuItem = {
  n: string;
  label: string;
  href: string;
  /** True when this still needs a dedicated page; it currently resolves to
   *  the nearest real section so the link is never broken. */
  pending?: boolean;
};

/** Menu destinations.
 *
 *  This is a single-route site: src/app/page.tsx is the only page. Items
 *  marked `pending` have no dedicated route yet and point at the section
 *  where that content currently lives, so every link works today. Give them a
 *  real route and change one href each.
 */
export const MENU: MenuItem[] = [
  { n: "01", label: "Womenswear", href: "#rails", pending: true },
  { n: "02", label: "Accessories", href: "#rails", pending: true },
  { n: "03", label: "Homeware", href: "#homeware" },
  { n: "04", label: "New Arrivals", href: "#new-in" },
  { n: "05", label: "The Boutique", href: "#our-story" },
  { n: "06", label: "Visit Us", href: "#visit" },
];

/** Social accounts.
 *
 *  Deliberately empty. No handles are held anywhere in this project, and a
 *  guessed URL on a real trading business's site sends customers to somebody
 *  else's account. The menu renders this row only when it has entries — add
 *  `{ name: "Instagram", href: "https://instagram.com/…" }` and it appears.
 */
export const socials: { name: string; href: string }[] = [];

/** Real directions link, built from the real address. Not a placeholder. */
export const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${shop.name}, ${shop.street}, ${shop.town} ${shop.postcode}`,
)}`;

/** Footer navigation.
 *
 *  Every href here resolves today. This project is a single route —
 *  src/app/page.tsx — so the site's navigation is section anchors, and a
 *  footer column of /privacy, /terms and /cookies would be three links to
 *  404s. They are omitted until those pages exist rather than linked and
 *  broken.
 *
 *  "Contact" is omitted for the same reason: shop.phone and shop.email are
 *  deliberately empty, so there is nothing to link to. The FAQ answers the
 *  question and the Visit section carries the address. */
export const footerNav: { heading: string; items: MenuItem[] }[] = [
  {
    heading: "Shop",
    items: [
      { n: "", label: "New In", href: "#new-in" },
      { n: "", label: "Womenswear", href: "#rails", pending: true },
      { n: "", label: "Accessories", href: "#rails", pending: true },
      { n: "", label: "Homeware", href: "#homeware" },
    ],
  },
  {
    heading: "B Boutique",
    items: [
      { n: "", label: "The Boutique", href: "#our-story" },
      { n: "", label: "The Rails", href: "#rails" },
      { n: "", label: "Questions", href: "#faq" },
      { n: "", label: "Visit Us", href: "#visit" },
    ],
  },
];
