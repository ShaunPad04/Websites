"use client";

import { useState } from "react";

/* The map, loaded on intent rather than on page load.
 *
 * Three reasons it works this way:
 *   - A blocked embed paints the browser's own error page — an opaque grey
 *     rectangle — straight over any fallback placed underneath it. Mounting
 *     the iframe only when asked is the only way the designed panel below is
 *     ever actually seen.
 *   - Google's embed sets third-party cookies. Loading it unprompted on a UK
 *     high-street site is a consent problem; loading it on a click is not.
 *   - It is a third-party iframe on the critical path. Not requesting it up
 *     front is worth real milliseconds.
 *
 * Whatever happens, the address and a working directions link are already on
 * the page, so nothing here is load-bearing. */
export function MapPanel({
  street,
  town,
  postcode,
  query,
  embedSrc,
  title,
  /** Layout only — the panel keeps its own surface and border. Lets the
   *  footer run a taller map than the Visit section without either one
   *  having to fork the component. */
  className = "mt-8 h-64",
}: {
  street: string;
  town: string;
  postcode: string;
  query: string;
  /** Where the iframe points. Separate from `query`, which is the readable
   *  address used for the links a person clicks. */
  embedSrc: string;
  title: string;
  className?: string;
}) {
  const [shown, setShown] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-onyx-lift ${className}`}>
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <div>
          <p className="display text-2xl text-bone">{street}</p>
          <p className="mt-1 text-sm text-bone/60">
            {town} · {postcode}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {!shown ? (
              <button
                type="button"
                onClick={() => setShown(true)}
                className="text-sm text-gold-lift underline underline-offset-4"
              >
                Show map
              </button>
            ) : null}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gold-lift underline underline-offset-4"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
      {shown ? (
        <iframe
          title={title}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.3] contrast-[1.05]"
        />
      ) : null}
    </div>
  );
}
