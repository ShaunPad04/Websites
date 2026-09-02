import { faq } from "@/lib/faq";

/* The practical questions — the calmest section on the page.
 *
 * Built on native <details name="faq">, not a JavaScript accordion, and kept
 * that way deliberately. The `name` attribute is what makes the group
 * exclusive: one answer open at a time, with no script. That gives for free
 * the things a hand-rolled accordion has to reimplement and usually gets
 * wrong — keyboard operation on Enter and Space, correct expanded/collapsed
 * semantics for assistive tech, and answers that exist as real HTML in the
 * document whether or not the row is open, so a search engine can read them.
 *
 * A <summary> already exposes its expanded state to assistive technology;
 * adding aria-expanded by hand would duplicate what the element reports and
 * risk the two disagreeing. So the trigger carries no ARIA of its own — the
 * semantics come from the element, which is the point of using it.
 *
 * Rules, not boxes: each row is a hairline and some breathing room. No card,
 * no background, no radius, no shadow.
 *
 * Nothing here states a policy the client has not confirmed. An answer either
 * comes from confirmed data in this repository or renders as a visible
 * internal marker — see the rule at the top of lib/faq.ts. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="faq">
      <div className="faq-inner">
        <div className="faq-intro">
          <p className="faq-eyebrow">Questions</p>
          <h2 id="faq-heading" className="faq-h2">
            A few things worth knowing.
          </h2>
          <p className="faq-lede">
            Everything you might want to know before visiting or ordering.
          </p>
        </div>

        <div className="faq-list">
          {faq.map((item, i) => (
            <details key={item.q} name="faq" className="faq-row">
              <summary className="faq-summary">
                <span className="faq-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-q">{item.q}</span>
                {/* One plus that turns 45° into a cross — the same two strokes
                    rotating, so the shape morphs rather than swapping glyph. */}
                <span className="faq-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
                    <path d="M8 1.5v13M1.5 8h13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>

              <div className="faq-answer">
                {item.a ? <p>{item.a}</p> : null}
                {item.pending ? <p className="faq-pending">[{item.pending}]</p> : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
