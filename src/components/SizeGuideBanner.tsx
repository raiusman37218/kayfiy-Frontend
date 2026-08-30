import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./Icons";

export default function SizeGuideBanner() {
  return (
    <section
      aria-label="Bra Size Calculator"
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8"
    >
      <div className="group relative overflow-hidden rounded-3xl border border-[#F2D4DA] bg-gradient-to-r from-[#FFF5F7] via-[#FCEDF0] to-[#EBE7E8] shadow-xs transition-all duration-300 hover:shadow-md">
        <div className="grid grid-cols-1 items-center md:grid-cols-12">
          
          {/* Left Column: Clean, Compact Typography & CTA */}
          <div className="z-10 flex flex-col justify-center p-6 sm:p-8 md:col-span-7 lg:col-span-6 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FCE4E8] px-3.5 py-1 text-[11px] font-bold tracking-[0.16em] text-[#C4526E] uppercase w-fit border border-[#F2BAC5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C4526E] animate-pulse" />
              Fit First Finder
            </div>

            <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black leading-tight">
              Find Your True <br className="hidden sm:inline" />
              <span className="text-[#C4526E]">Bra Size in 30 Seconds</span>
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-black/85 max-w-md">
              No more digging straps or tight bands. Take 2 simple measurements for all-day comfort and a perfect true-to-body fit.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-black">
              <span className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C4526E] text-white text-[9px] font-bold">✓</span>
                Bust & Underbust Sizing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C4526E] text-white text-[9px] font-bold">✓</span>
                Honest Pakistani Cup Fit
              </span>
            </div>

            <div className="mt-6">
              <Link
                href="/pages/bra-size-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3 text-xs font-bold tracking-[0.16em] text-white uppercase transition-all duration-300 hover:bg-[#C4526E] hover:shadow-md cursor-pointer"
              >
                <span>Calculate My Size</span>
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Girl with measuring tape (100% visible on mobile & desktop) */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:h-full md:min-h-[300px] lg:min-h-[340px] md:col-span-5 lg:col-span-6 overflow-hidden">
            <Image
              src="/banners/size-calculator-girl.jpg"
              alt="Woman measuring bra size with tape"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, (min-width: 768px) 45vw, 100vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-102"
            />
            {/* Subtle smooth left fade on desktop */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FCEDF0] to-transparent hidden md:block" />
          </div>

        </div>
      </div>
    </section>
  );
}
