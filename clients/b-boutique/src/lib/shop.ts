/** Single source of truth for B Boutique. Everything on the site — the
 *  "open now" badge, the hours table, the schema.org markup — reads from here.
 *  Change it once, it changes everywhere. */

export const shop = {
  name: "B Boutique",
  /* Fill these in and they appear in the menu's contact block automatically.
     Left empty rather than guessed — a wrong number on a real shop's site
     sends customers to a stranger. */
  phone: "" as string,
  email: "" as string,
  street: "18 Sea View Street",
  town: "Cleethorpes",

  /* The shop's own point, taken from the client's Google Maps link on
     2026-09-01 (the !3d/!4d pair — the @ pair in a Maps URL is the viewport
     centre and sat 170m west of the building).
     The address is Google's, on the client's instruction 2026-09-01: it was
     briefed as "18 Seaview Street … DN35 8HY", and Google resolves the
     building as "18 Sea View St … DN35 8EZ". Both the street spelling and the
     postcode changed. "Street" is written out rather than Google's "St",
     which is a display abbreviation, not part of the name. */
  lat: 53.5574101,
  lng: -0.0259913,
  county: "North East Lincolnshire",
  postcode: "DN35 8EZ",
  country: "GB",
} as const;

export const addressLines = [shop.street, shop.town, shop.postcode];

/** 0 = Sunday, matching Date.getDay(). null = closed. Times are 24h local. */
export type Hours = { open: number; close: number } | null;

export const hours: readonly { day: string; short: string; hours: Hours }[] = [
  { day: "Monday",    short: "Mon", hours: null },
  { day: "Tuesday",   short: "Tue", hours: { open: 10, close: 16 } },
  { day: "Wednesday", short: "Wed", hours: { open: 10, close: 16 } },
  { day: "Thursday",  short: "Thu", hours: { open: 10, close: 16 } },
  { day: "Friday",    short: "Fri", hours: { open: 10, close: 16 } },
  { day: "Saturday",  short: "Sat", hours: { open: 10, close: 16 } },
  { day: "Sunday",    short: "Sun", hours: { open: 10, close: 16 } },
];

/** hours[] is indexed Monday-first; Date.getDay() is Sunday-first. */
export function hoursForWeekday(jsDay: number): Hours {
  return hours[(jsDay + 6) % 7].hours;
}

export function formatHour(h: number): string {
  const suffix = h < 12 ? "am" : "pm";
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return `${twelve}${suffix}`;
}

export type OpenState =
  | { state: "open"; closesAt: string }
  | { state: "opening-soon"; opensAt: string }
  | { state: "closed"; nextDay: string; opensAt: string };

/** Derives the badge copy from a given moment. Pure, so it is testable
 *  and so server and client can agree on the result. */
export function openState(now: Date): OpenState {
  const today = hoursForWeekday(now.getDay());
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (today) {
    if (minutes >= today.open * 60 && minutes < today.close * 60) {
      return { state: "open", closesAt: formatHour(today.close) };
    }
    if (minutes < today.open * 60) {
      return { state: "opening-soon", opensAt: formatHour(today.open) };
    }
  }

  // Walk forward to the next day that actually opens.
  for (let i = 1; i <= 7; i++) {
    const day = (now.getDay() + i) % 7;
    const next = hoursForWeekday(day);
    if (next) {
      return {
        state: "closed",
        nextDay: i === 1 ? "tomorrow" : hours[(day + 6) % 7].day,
        opensAt: formatHour(next.open),
      };
    }
  }
  return { state: "closed", nextDay: "soon", opensAt: "10am" };
}

/** The rails. These drive the expanding panels. */
export const categories = [
  { slug: "all",         name: "Shop All",    note: "Everything on the rails this week, in one place." },
  { slug: "jackets",     name: "Jackets",     note: "For a street that faces the sea." },
  { slug: "trousers",    name: "Trousers",    note: "Wide, tailored, and cut to actually fit." },
  { slug: "dresses",     name: "Dresses",     note: "Occasion, day, and the one you keep coming back to." },
  { slug: "tops",        name: "Tops",        note: "Silk, cotton and stripes that go with everything." },
  { slug: "knitwear",    name: "Knitwear",    note: "Lambswool, cotton, and proper weight." },
  { slug: "accessories", name: "Accessories", note: "Bags, scarves, and small gold things." },
  { slug: "homeware",    name: "Homeware",    note: "Candles, ceramics, and things worth wrapping." },
] as const;

export type Category = (typeof categories)[number];

/** New in. Prices deliberately absent — the shop sells in person,
 *  and stock turns faster than a website does. */
export const newIn = [
  { slug: "wool-trouser",    name: "Wide-leg wool trouser",  category: "Trousers",    tone: "bone" },
  { slug: "camel-blazer",    name: "Tailored camel blazer",  category: "Jackets",     tone: "marble" },
  { slug: "lambswool-crew",  name: "Ribbed lambswool crew",  category: "Knitwear",    tone: "gold" },
  { slug: "cotton-tee",      name: "Heavyweight cotton tee", category: "Tops",        tone: "bone" },
  { slug: "slip-dress",      name: "Bias-cut silk slip dress", category: "Dresses",   tone: "onyx" },
  { slug: "leather-crossbody", name: "Leather crossbody",    category: "Accessories", tone: "marble" },
  { slug: "silk-scarf",      name: "Silk twill scarf",       category: "Accessories", tone: "gold" },
  { slug: "stoneware-carafe", name: "Stoneware carafe",      category: "Homeware",    tone: "onyx" },
  { slug: "boucle-overshirt", name: "Boucle overshirt",      category: "Jackets",     tone: "bone" },
] as const;


/** The five featured category panels.
 *
 *  A subset of `categories` above rather than a second taxonomy — `slug` is
 *  the join, so a rename in one place cannot leave the two disagreeing. Only
 *  what the panels add lives here: the photograph, its alt text and the
 *  displayed number.
 *
 *  `href` is "#visit" for all five because no category route exists yet, and
 *  a link to a page that 404s is worse than a link to the one place these
 *  clothes can actually be seen — the shop sells in person, not online. When
 *  real category pages exist, change these five hrefs and nothing else moves.
 *
 *  The images are the final approved assets: real WebP, 1500x2000, 3:4,
 *  full colour at source. The monochrome resting state is a CSS filter, never
 *  baked into the file. */
export const featured = [
  {
    slug: "jackets",
    number: "01",
    name: "Jackets",
    image: "/img/category-jackets.webp",
    alt: "Model wearing a structured black jacket",
    href: "#visit",
  },
  {
    slug: "trousers",
    number: "02",
    name: "Trousers",
    image: "/img/category-trousers.webp",
    alt: "Model wearing tailored black trousers",
    href: "#visit",
  },
  {
    slug: "dresses",
    number: "03",
    name: "Dresses",
    image: "/img/category-dresses.webp",
    alt: "Model wearing a black midi dress",
    href: "#visit",
  },
  {
    slug: "knitwear",
    number: "04",
    name: "Knitwear",
    image: "/img/category-knitwear.webp",
    alt: "Model wearing charcoal knitwear",
    href: "#visit",
  },
  {
    slug: "accessories",
    number: "05",
    name: "Accessories",
    image: "/img/category-accessories.webp",
    alt: "Model carrying a structured black handbag",
    href: "#visit",
  },
] as const;
