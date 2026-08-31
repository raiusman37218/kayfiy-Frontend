import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./Icons";

const POINTS = [
  "Two measurements, thirty seconds",
  "Sister sizes if yours runs out",
  "Shows the bras we stock in your size",
];

export default function SizeGuideBanner() {
  return (
    <section
      aria-label="Bra size calculator"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20"
    >
      <div className="group relative overflow-hidden rounded-3xl bg-maroon shadow-sm">
        {/* Zari-style gold hairline along the top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="grid grid-cols-1 items-stretch md:grid-cols-12">
          {/* Copy */}
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 md:col-span-7 lg:col-span-6 lg:p-11">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-3.5 py-1 text-[10px] font-bold tracking-[0.18em] text-gold-soft uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Fit first
            </span>

            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl leading-tight font-bold tracking-tight text-cream sm:text-4xl lg:text-[2.75rem]">
              Find your true bra size
            </h2>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/75">
              Most of us wear the wrong band. Two quick measurements and we will
              tell you your size &mdash; and show you what we actually have in it.
            </p>

            <ul className="mt-5 space-y-2">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-xs font-medium text-cream/85"
                >
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-gold"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Link
                href="/pages/bra-size-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-maroon uppercase transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <span>Calculate my size</span>
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Photo */}
          <div className="relative aspect-16/10 w-full overflow-hidden sm:aspect-16/9 md:col-span-5 md:aspect-auto md:h-full md:min-h-[340px] lg:col-span-6">
            <Image
              src="/banners/size-calculator-girl.jpg"
              alt="Measuring for the correct bra size with a tape"
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 768px) 45vw, 100vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Blend the photo into the maroon panel */}
            <div className="absolute inset-0 bg-maroon/15" />
            <div className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-maroon to-transparent md:block" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-maroon to-transparent md:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
