import { shop, hours, formatHour } from "@/lib/shop";
import { OpenBadge } from "./OpenBadge";
import { MapPanel } from "./MapPanel";
import { Reveal } from "./Reveal";

const MAPS_QUERY = encodeURIComponent(
  `${shop.name}, ${shop.street}, ${shop.town} ${shop.postcode}`,
);

/* This is the conversion point. Not a basket — a postcode. */
export function Visit() {
  return (
    <section
      id="visit"
      aria-labelledby="visit-heading"
      className="relative grain scroll-mt-24 bg-onyx py-20 text-bone sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="label text-gold-lift">05 — Come in</p>
          <h2 id="visit-heading" data-split className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">
            18 Seaview Street
          </h2>

          <address className="mt-6 not-italic text-lg leading-relaxed text-bone/80">
            {shop.street}
            <br />
            {shop.town}
            <br />
            {shop.postcode}
          </address>

          <div className="mt-6">
            <OpenBadge onDark />
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-bone px-7 py-3.5 text-onyx transition-colors hover:bg-gold hover:text-bone"
            >
              Get directions
            </a>
          </div>

          <p className="mt-8 max-w-sm text-sm leading-relaxed text-bone/60">
            Seaview Street runs up from the seafront. There is on-street parking
            at the top and the Market Place car park is a two-minute walk.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <h3 className="label text-bone/50">Opening times</h3>
          <dl className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {hours.map((d) => {
              const open = d.hours;
              const closed = open === null;
              return (
                <div
                  key={d.day}
                  className="flex items-baseline justify-between gap-6 py-3.5"
                >
                  <dt className={closed ? "text-bone/40" : "text-bone"}>{d.day}</dt>
                  <dd
                    className={
                      closed
                        ? "text-bone/40"
                        : "tabular-nums text-bone/85"
                    }
                  >
                    {open === null
                      ? "Closed"
                      : `${formatHour(open.open)} — ${formatHour(open.close)}`}
                  </dd>
                </div>
              );
            })}
          </dl>

          <MapPanel
            street={shop.street}
            town={shop.town}
            postcode={shop.postcode}
            query={MAPS_QUERY}
            title={`Map showing ${shop.name}, ${shop.street}, ${shop.town}`}
          />
        </Reveal>
      </div>
    </section>
  );
}
