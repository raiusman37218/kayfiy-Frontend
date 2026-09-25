"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowIcon, CloseIcon } from "./Icons";
import BraSizeCalculator from "./BraSizeCalculator";

const POINTS = [
  "Two measurements, thirty seconds",
  "Sister sizes if yours runs out",
  "Instant fit recommendation & sizing guide",
];

export default function SizeGuideBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      aria-label="Bra size calculator"
      className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-6 lg:py-16"
    >
      <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-maroon shadow-md">
        {/* Zari-style gold hairline along the top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Mobile Background Image with Soft Gradient Fade (Zero extra vertical height!) */}
        <div className="absolute inset-0 md:hidden pointer-events-none">
          <Image
            src="/banners/size-calculator-girl.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon via-maroon/95 to-maroon/75" />
        </div>

        <div className="grid grid-cols-1 items-stretch md:grid-cols-12">
          {/* Copy */}
          <div className="relative z-10 flex flex-col justify-center p-4 sm:p-8 md:col-span-7 lg:col-span-6 lg:p-11">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/40 px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[8.5px] sm:text-[10px] font-bold tracking-[0.14em] text-gold-soft uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Fit First · Smart Calculator
            </span>

            <h2 className="mt-2 sm:mt-4 font-[family-name:var(--font-heading)] text-lg sm:text-3xl lg:text-[2.75rem] leading-tight font-bold tracking-tight text-cream">
              Find your true bra size
            </h2>

            <p className="mt-1.5 max-w-md text-[11px] sm:text-sm leading-relaxed text-cream/80">
              80% of women wear the incorrect cup size. Discover your perfect fit and sister sizes in 30 seconds.
            </p>

            {/* Bullets: Hidden on Mobile to keep card compact, shown on desktop */}
            <ul className="mt-4 space-y-1.5 hidden sm:block">
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

            <div className="mt-3.5 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-cream px-3.5 py-2 sm:px-7 sm:py-3.5 text-[11px] sm:text-xs font-bold tracking-[0.12em] text-maroon uppercase transition-all duration-300 hover:bg-white hover:shadow-lg active:scale-95"
              >
                <span>Calculate my size</span>
                <ArrowIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <Link
                href="/pages/bra-size-calculator"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cream/30 px-3 py-2 sm:px-5 sm:py-3.5 text-[11px] sm:text-xs font-semibold tracking-wider text-cream/90 transition hover:bg-white/10"
              >
                <span>Full Guide</span>
              </Link>
            </div>
          </div>

          {/* Photo: Desktop side panel */}
          <div className="relative hidden md:block md:col-span-5 lg:col-span-6 md:h-full md:min-h-[320px] overflow-hidden">
            <Image
              src="/banners/size-calculator-girl.jpg"
              alt="Measuring for the correct bra size with a tape"
              fill
              sizes="(min-width: 1024px) 50vw, 45vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Blend the photo into the maroon panel */}
            <div className="absolute inset-0 bg-maroon/15" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-maroon to-transparent" />
          </div>
        </div>
      </div>

      {/* Interactive Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#7A2A3D] uppercase">
                  Fit Guide & Size Finder
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-charcoal">
                  Calculate Your True Bra Size
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close Calculator"
                className="cursor-pointer rounded-full p-2 text-muted transition hover:bg-blush hover:text-charcoal"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <BraSizeCalculator />
          </div>
        </div>
      )}
    </section>
  );
}
