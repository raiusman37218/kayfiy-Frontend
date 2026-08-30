import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./Icons";

export default function SizeGuideBanner() {
  return (
    <section
      aria-label="Bra Size Calculator"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12"
    >
      <div className="group relative overflow-hidden rounded-3xl border border-[#F2D4DA] bg-gradient-to-br from-[#FFF5F7] via-[#FDF0F3] to-[#FCECEF] shadow-sm transition-all duration-500 hover:shadow-xl">
        <div className="grid grid-cols-1 items-center md:grid-cols-12">
          
          {/* Left Column: Branded Calculator Card */}
          <div className="z-10 flex flex-col justify-center p-6 sm:p-10 md:col-span-6 lg:col-span-5 lg:p-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FCE4E8] px-3.5 py-1 text-[11px] font-semibold tracking-[0.2em] text-[#C4526E] uppercase w-fit border border-[#F2BAC5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C4526E] animate-pulse" />
              Fit First Finder
            </div>

            <div className="mt-4 rounded-3xl bg-[#FEEBED]/90 border border-[#F7CCD4] p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2B2724] leading-[1.1]">
                BRA SIZE <br />
                <span className="text-[#C4526E]">CALCULATOR</span>
              </h2>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#6F645E]">
                Two simple measurements, 30 seconds, and a size you can comfortably wear all day long without digging or pinching.
              </p>

              <div className="mt-6 flex flex-col gap-2 text-xs font-medium text-[#4A0E1A]">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C4526E] text-white text-[9px] font-bold">✓</span>
                  <span>Underbust & Bust Measurement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C4526E] text-white text-[9px] font-bold">✓</span>
                  <span>Honest Pakistani Cup & Band Sizing</span>
                </div>
              </div>

              <div className="mt-7">
                <Link
                  href="/pages/bra-size-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3A3330] px-8 py-3.5 text-xs font-bold tracking-[0.18em] text-white uppercase transition-all duration-300 hover:bg-[#C4526E] hover:scale-102 hover:shadow-md cursor-pointer"
                >
                  <span>CALCULATE</span>
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Custom 2D Vector Illustration Art */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-auto md:h-full md:min-h-[460px] md:col-span-6 lg:col-span-7 overflow-hidden">
            <Image
              src="/banners/custom-bra-calculator-art.jpg"
              alt="Woman measuring bra size illustration"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-center transition duration-500 group-hover:scale-103"
            />
            {/* Subtle blending gradient from left to image */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FFF5F7] to-transparent hidden md:block" />
          </div>

        </div>
      </div>
    </section>
  );
}
