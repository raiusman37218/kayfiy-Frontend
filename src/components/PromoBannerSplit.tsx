import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./Icons";
import { SECTION_BANNERS } from "@/lib/images";

export default function PromoBannerSplit() {
  return (
    <section
      aria-label="Featured Collections"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12"
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Left Card: Everyday Bras */}
        <Link
          href="/collections/bras"
          aria-label="Shop Everyday Bras"
          className="group relative block aspect-[16/10] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl bg-blush shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
        >
          <Image
            src={SECTION_BANNERS.bras.desktop}
            alt="Everyday Bras collection"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <span className="w-fit rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              Everyday Comfort
            </span>
            <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white leading-tight">
              Padded & T-Shirt Bras
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-1">
              Breathable fabrics, smooth seamless cups, sizes 30A to 44DD.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white">
              <span className="border-b border-white/60 pb-0.5 group-hover:border-white">
                Explore Collection
              </span>
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Right Card: Luxury Sets */}
        <Link
          href="/collections/bra-sets"
          aria-label="Shop Matching Sets"
          className="group relative block aspect-[16/10] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl bg-blush shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
        >
          <Image
            src={SECTION_BANNERS.braSets.desktop}
            alt="Matched Bra Sets collection"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <span className="w-fit rounded-full bg-gold/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal">
              Curated Sets
            </span>
            <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white leading-tight">
              Lace & Satin Matched Sets
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-1">
              Coordinated bra and brief sets, from daily luxury to bridal trousseau.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white">
              <span className="border-b border-white/60 pb-0.5 group-hover:border-white">
                Shop Bra Sets
              </span>
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
