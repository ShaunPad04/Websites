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
  street: "18 Seaview Street",
  town: "Cleethorpes",
  county: "North East Lincolnshire",
  postcode: "DN35 8HY",
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
  { slug: "linen-trouser",   name: "Wide-leg linen trouser", category: "Trousers",    tone: "bone" },
  { slug: "wool-jacket",     name: "Cropped wool jacket",    category: "Jackets",     tone: "marble" },
  { slug: "lambswool-crew",  name: "Ribbed lambswool crew",  category: "Knitwear",    tone: "gold" },
  { slug: "tea-dress",       name: "Midi tea dress",         category: "Dresses",     tone: "onyx" },
  { slug: "leather-crossbody", name: "Leather crossbody",    category: "Accessories", tone: "marble" },
  { slug: "silk-scarf",      name: "Silk twill scarf",       category: "Accessories", tone: "gold" },
  { slug: "stoneware-carafe", name: "Stoneware carafe",      category: "Homeware",    tone: "onyx" },
  { slug: "boucle-overshirt", name: "Boucle overshirt",      category: "Jackets",     tone: "bone" },
] as const;

/** The marquee below the hero.
 *
 *  Deliberately the shop's own language, not brand logos: naming labels a
 *  real trading business may not stock is a claim, not decoration. Swap these
 *  for `{ name, src: "/img/brands/x.svg" }` once the stockist list is known —
 *  LogoCarousel3D already renders an <img> whenever `src` is present.
 */
export const marquee = [
  { name: "WOMENSWEAR" },
  { name: "ACCESSORIES" },
  { name: "HOMEWARE" },
  { name: "SMALL RUNS" },
  { name: "NO REPEATS" },
  { name: "CHOSEN BY HAND" },
  { name: "SEAVIEW STREET" },
] as const;
