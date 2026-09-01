import { faq } from "@/lib/faq";
import { Reveal } from "./Reveal";

/* The practical questions, placed after the fashion storytelling and before
 * the address — the point in the page where someone has decided they are
 * interested and wants to know how to actually turn up.
 *
 * Built on native <details name="faq">, not a JavaScript accordion. The
 * `name` attribute is what makes the group exclusive, so only one answer is
 * open at a time with no script at all. That buys, for free, the things a
 * hand-rolled accordion has to reimplement and usually gets wrong: keyboard
 * operation, the correct expanded/collapsed semantics for assistive tech, and
 * — the one that matters for a shop — answers that are real HTML in the
 * document whether or not the panel is open, so they are crawlable.
 *
 * Where `name` is unsupported the rows still open and close; more than one
 * can simply be open at once. Where the open/close transition is unsupported
 * they snap. Both are honest degradations of the same markup. */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative grain scroll-mt-24 bg-bone py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-24">
        <Reveal>
          <p className="label text-onyx/65">05 — Questions</p>
          <h2
            id="faq-heading"
            data-split
            className="display mt-4 text-[clamp(2rem,4.5vw,3.5rem)] text-onyx"
          >
            A few things
            <br />
            worth knowing.
          </h2>
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-onyx/65">
            Everything you might want to know before visiting or ordering.
          </p>
        </Reveal>

        <div className="faq-list">
          {faq.map((item, i) => (
            <details key={item.q} name="faq" className="faq-row">
              <summary className="faq-summary">
                <span className="label faq-n">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="faq-q">{item.q}</span>
                {/* One plus that turns 45° into a cross — same two strokes, so
                    the shape morphs rather than swapping. */}
                <svg
                  className="faq-icon"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M8 1.5v13M1.5 8h13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </summary>

              <div className="faq-answer">
                {item.a ? (
                  <p>
                    {/* The reference's signature is a staggered text reveal.
                        Kept, but per word rather than per character, and as a
                        fade with no blur: at the reference's 15ms per
                        character these answers would take three seconds to
                        become readable, which is a poor trade in the one
                        place on the page where someone wants the answer
                        immediately. The spans stay `display: inline` and
                        animate opacity only, so line breaking and word
                        spacing are exactly as they would be without them. */}
                    {item.a.split(" ").map((w, wi) => (
                      <span
                        key={wi}
                        className="faq-w"
                        style={{ "--i": Math.min(wi, 18) } as React.CSSProperties}
                      >
                        {w}{wi < item.a!.split(" ").length - 1 ? " " : ""}
                      </span>
                    ))}
                  </p>
                ) : null}
                {item.pending ? (
                  <p className="faq-pending">[{item.pending}]</p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
