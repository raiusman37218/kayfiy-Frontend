import Link from "next/link";
import { ArrowIcon } from "./Icons";

export default function SizeGuideBanner() {
  return (
    <section className="bg-blush">
      <Link
        href="/pages/bra-size-calculator"
        className="group mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:py-16"
      >
        <div>
          <p className="text-[11px] tracking-[0.2em] text-rose uppercase">
            Fit First
          </p>
          <h2 className="mt-2 font-serif text-3xl text-charcoal sm:text-4xl">
            Calculate Your Bra Size
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Two measurements, thirty seconds, and a size you can actually wear
            all day. Our calculator maps your numbers to Lisset cup and band
            sizing.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition group-hover:bg-rose">
          Find My Size
          <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </Link>
    </section>
  );
}
