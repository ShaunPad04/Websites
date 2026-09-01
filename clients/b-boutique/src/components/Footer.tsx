import { footerNav, socials, directionsHref, mapsQuery } from "@/lib/nav";
import { MapPanel } from "./MapPanel";
import { shop, addressLines } from "@/lib/shop";

/* The closing page of the editorial.
 *
 * Structurally this follows the reference — brand, navigation, socials,
 * diagonal divider, copyright — but laid out as an editorial grid rather than
 * a centred column, and with the reference's SaaS tells removed: no pill
 * background growing behind links on hover, no 1.05 scale, no spring at
 * stiffness 260. Those read as software. This is a shop.
 *
 * The entrance stagger is the part worth keeping, and it is done with a
 * scroll-driven CSS timeline rather than Motion's whileInView. Same
 * intersection-triggered result, but the footer stays a server component and
 * ships no JavaScript — which matters here, because motion/react is
 * deliberately kept off this page's critical path. Where scroll-driven
 * animation is unsupported the footer simply renders, fully visible.
 *
 * The top-left block is the map; the brand statement is the closing
 * wordmark alone.
 *
 * Every href resolves. There is one route in this project, so navigation is
 * section anchors; /privacy, /terms and /cookies do not exist and are not
 * linked. See footerNav. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-shell relative bg-panel text-bone">
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:pt-28">
        {/* ── Brand + newsletter ─────────────────────────────────────── */}
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-24">
          {/* The map, not a second wordmark. The closing mark at the foot of
              the page carries the brand on its own now, and a shop's footer is
              a more useful place for a pin than for a repeat signature.
              Reuses the Visit section's MapPanel rather than a second map:
              same click-to-load behaviour, so Google's cookies still are not
              set until someone asks for them, and no extra weight — the
              component is already on the page. */}
          <div className="footer-rise" style={{ "--d": "0%" } as React.CSSProperties}>
            <p className="label text-bone/55">Find us</p>
            <MapPanel
              street={shop.street}
              town={shop.town}
              postcode={shop.postcode}
              query={mapsQuery}
              title={`Map showing ${shop.name}, ${shop.street}, ${shop.town}`}
              className="mt-5 h-[17rem] sm:h-[20rem]"
            />
          </div>

          <div className="footer-rise" style={{ "--d": "6%" } as React.CSSProperties}>
            <p className="label text-bone/55">Newsletter</p>
            <p className="display mt-4 text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight">
              A few good things, occasionally.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-bone/60">
              New arrivals, in-store edits and the occasional note from Sea View
              Street.
            </p>

            <form className="footer-form mt-8" noValidate>
              <label htmlFor="footer-email" className="label text-bone/50">
                Email address
              </label>
              <div className="footer-field">
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="footer-input"
                />
                {/* type="button", and no action on the form: there is no
                    provider connected, and a submit here would reload the page
                    with the address in the query string. Wired up properly the
                    moment a list provider is chosen. */}
                <button type="button" className="footer-send" aria-describedby="footer-note">
                  <span className="sr-only">Sign up</span>
                  <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
                    <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p id="footer-note" className="footer-pending">
                [NEWSLETTER NOT CONNECTED — AWAITING LIST PROVIDER]
              </p>
            </form>
          </div>
        </div>

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <nav
          aria-label="Footer"
          className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16"
        >
          {footerNav.map((group, gi) => (
            <div
              key={group.heading}
              className="footer-rise"
              style={{ "--d": `${12 + gi * 5}%` } as React.CSSProperties}
            >
              <h2 className="label text-bone/50">{group.heading}</h2>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="footer-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-rise" style={{ "--d": "22%" } as React.CSSProperties}>
            <h2 className="label text-bone/50">Visit</h2>
            <address className="mt-5 space-y-3 not-italic">
              {addressLines.map((line) => (
                <p key={line} className="text-[0.9375rem] text-bone/70">
                  {line}
                </p>
              ))}
            </address>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link mt-3 inline-block"
            >
              Get directions
              <span className="footer-arrow" aria-hidden="true"> ↗</span>
            </a>
          </div>
        </nav>

        {/* ── Socials ────────────────────────────────────────────────── */}
        <div className="footer-rise mt-16" style={{ "--d": "28%" } as React.CSSProperties}>
          {socials.length > 0 ? (
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social label"
                  >
                    {s.name}
                    <span className="footer-arrow" aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="footer-pending">
              [CLIENT TO CONFIRM SOCIAL ACCOUNTS — INSTAGRAM, FACEBOOK, TIKTOK]
            </p>
          )}
        </div>
      </div>

      {/* ── Woven rule ─────────────────────────────────────────────────
          The reference's diagonal band, slowed right down and dropped to a
          whisper: at 30s a cycle and 6% ivory it reads as printed texture
          across the page rather than as something loading. */}
      <div className="footer-weave mt-20" aria-hidden="true">
        <div className="footer-weave-inner" />
      </div>

      {/* ── Closing wordmark ───────────────────────────────────────────
          Bookends the hero. Sized in vw and allowed to breathe rather than
          bleed, so it is never clipped at any width. */}
      <div className="mx-auto max-w-[100rem] px-6">
        <p
          className="footer-mark footer-rise display select-none"
          style={{ "--d": "34%" } as React.CSSProperties}
        >
          {shop.name}
          <span className="footer-reg-lg" aria-hidden="true">®</span>
        </p>
      </div>

      {/* ── Legal ──────────────────────────────────────────────────────
          No privacy, terms or cookies links: those routes do not exist in
          this project, and three links to 404s is worse than none. */}
      <div className="mx-auto max-w-7xl px-6 pb-10">
        {/* /55, not the /45 this first shipped with: bone at 45% measures
            4.19:1 on --panel and fails AA. The brand rail hit the identical
            floor earlier and carries the same note. */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-white/10 pt-8">
          <p className="label text-bone/55">
            © {year} {shop.name}
          </p>
          <p className="label text-bone/55">Tuesday to Sunday, 10 till 4</p>
        </div>
      </div>
    </footer>
  );
}
