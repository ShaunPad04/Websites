import type { ReactNode } from "react";

/* The CTA shape from the reference: a pill with a filled circular arrow
   badge set into its left end. The arrow rotating to point along the
   travel direction on hover is the whole micro-interaction — one move,
   200ms, no bounce. */
export function ArrowButton({
  href,
  children,
  tone = "light",
  external = false,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  external?: boolean;
}) {
  const shell =
    tone === "light"
      ? "bg-bone text-onyx hover:bg-white"
      : "bg-onyx text-bone hover:bg-onyx-lift";

  // The badge inverts against its own pill. A black badge on a black pill
  // would vanish, so the dark variant flips to bone with a dark arrow.
  const badge =
    tone === "light" ? "bg-onyx text-bone" : "bg-bone text-onyx";

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex shrink-0 items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm transition-colors sm:gap-3 sm:pr-6 sm:text-[0.9375rem] ${shell}`}
    >
      <span
        aria-hidden="true"
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-300 ease-out group-hover:rotate-45 sm:h-9 sm:w-9 ${badge}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 11L11 3M11 3H4.5M11 3v6.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </a>
  );
}
