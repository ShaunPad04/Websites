import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { shop, hours } from "@/lib/shop";
import "./globals.css";

/* The shop is black marble and polished gold, so the type is high-contrast
   fashion-plate rather than soft and crafty. Bodoni Moda has the thick/thin
   stress that suits the room; Jost is a geometric sans that keeps the body
   crisp beside it. Deliberately not Playfair + Inter, the default pairing on
   every boutique site on the internet. */
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "An independent boutique on Seaview Street, Cleethorpes. Womenswear, accessories and homeware, chosen one piece at a time. Open Tuesday to Sunday, 10 till 4.";

export const metadata: Metadata = {
  metadataBase: new URL("https://bboutique.co.uk"),
  title: {
    default: "B Boutique — Womenswear & Homeware, Seaview Street, Cleethorpes",
    template: "%s — B Boutique, Cleethorpes",
  },
  description,
  keywords: [
    "boutique Cleethorpes",
    "womens clothing Cleethorpes",
    "Seaview Street shops",
    "independent boutique North East Lincolnshire",
    "homeware Cleethorpes",
  ],
  openGraph: {
    title: "B Boutique — Seaview Street, Cleethorpes",
    description,
    type: "website",
    locale: "en_GB",
    siteName: "B Boutique",
  },
  robots: { index: true, follow: true },
};

/* Schema.org. For a shop people have to physically find, this is not
   decoration — it is what puts the hours and the pin in Google. */
function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: shop.name,
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.street,
      addressLocality: shop.town,
      addressRegion: shop.county,
      postalCode: shop.postcode,
      addressCountry: shop.country,
    },
    openingHoursSpecification: hours
      .filter((d) => d.hours !== null)
      .map((d) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${d.day}`,
        opens: `${String(d.hours!.open).padStart(2, "0")}:00`,
        closes: `${String(d.hours!.close).padStart(2, "0")}:00`,
      })),
    currenciesAccepted: "GBP",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${bodoni.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bone text-onyx">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-full focus:bg-onyx focus:px-5 focus:py-3 focus:text-bone"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
