import { shop, hours, formatHour } from "@/lib/shop";
import { directionsHref, mapEmbedSrc } from "@/lib/nav";
import { VisitMap } from "./VisitMap";

/* The conversion point. Not a basket — a postcode.
 *
 * Every value here derives from shop.ts: the address, the coordinates behind
 * the map, the directions link and the hours table. There is no second copy
 * of any of it, so a change there changes this and the JSON-LD together.
 *
 * ── Two things deliberately absent ────────────────────────────────────────
 * The parking sentence is gone. "On-street parking at the top, and the Market
 * Place car park is a two-minute walk" is a checkable local claim that nobody
 * has confirmed, and the address confirmation does not cover it. It is not
 * softened or hedged here — it is simply not asserted.
 *
 * The live "open now" badge is gone too. openState() reads the VISITOR's
 * clock, not Cleethorpes': at one instant when the shop is genuinely open, a
 * New York visitor was told "Opening at 10am" and a Sydney visitor "Closed —
 * open tomorrow". A wrong opening claim is worse than none, and the hours
 * table below says the same thing without ever being wrong. OpenBadge and
 * openState are untouched and still there for when the timezone is fixed. */
export function Visit() {
  return (
    <section id="visit" aria-labelledby="visit-heading" className="visit">
      <div className="visit-inner">
        <div className="visit-info">
          <p className="visit-eyebrow">Visit B Boutique</p>

          <h2 id="visit-heading" className="visit-address">
            <span>{shop.street}</span>
            <span>{shop.town}</span>
            <span>{shop.postcode}</span>
          </h2>

          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-cta"
          >
            Get directions <span className="visit-cta-arrow" aria-hidden="true">&rarr;</span>
          </a>

          <div className="visit-hours">
            <h3 className="visit-hours-label">Opening hours</h3>
            <dl className="visit-hours-list">
              {hours.map((d) => (
                <div key={d.day} className="visit-hours-row">
                  <dt>{d.day}</dt>
                  <dd className={d.hours ? "" : "is-closed"}>
                    {d.hours
                      ? `${formatHour(d.hours.open)} — ${formatHour(d.hours.close)}`
                      : "Closed"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="visit-map">
          <VisitMap
            street={shop.street}
            town={shop.town}
            postcode={shop.postcode}
            embedSrc={mapEmbedSrc}
            directionsHref={directionsHref}
            title={`Map showing ${shop.name}, ${shop.street}, ${shop.town} ${shop.postcode}`}
          />
        </div>
      </div>
    </section>
  );
}
