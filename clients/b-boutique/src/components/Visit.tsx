import { shop, hours, formatHour } from "@/lib/shop";
import { OpenBadge } from "./OpenBadge";
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
          <h2 id="visit-heading" className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">
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

          <div className="relative mt-8 h-64 overflow-hidden rounded-2xl border border-white/10 bg-onyx-lift">
            {/* Fallback sits underneath: if the embed is blocked, this is what
                shows, and it still tells you where the shop is. */}
            <div className="absolute inset-0 grid place-items-center px-6 text-center">
              <div>
                <p className="display text-2xl text-bone">{shop.street}</p>
                <p className="mt-1 text-sm text-bone/60">
                  {shop.town} · {shop.postcode}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-gold-lift underline underline-offset-4"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
            <iframe
              title={`Map showing ${shop.name}, ${shop.street}, ${shop.town}`}
              src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[0.3] contrast-[1.05]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
