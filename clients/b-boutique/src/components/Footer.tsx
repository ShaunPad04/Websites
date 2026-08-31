import { shop } from "@/lib/shop";

export function Footer() {
  return (
    <footer className="bg-onyx pb-10 text-bone/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="border-t border-white/10 pt-10">
          <p className="display max-w-xl text-[clamp(1.25rem,2.4vw,1.75rem)] italic leading-snug text-bone/85">
            A high street is only as good as the people still willing to stand
            behind a counter on it.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm">
            <p>
              © {new Date().getFullYear()} {shop.name} · {shop.street},{" "}
              {shop.town} {shop.postcode}
            </p>
            <p className="text-bone/60">Tuesday to Sunday, 10 till 4</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
