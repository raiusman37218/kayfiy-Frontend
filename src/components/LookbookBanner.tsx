import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./Icons";

export default function LookbookBanner() {
  return (
    <section
      aria-label="The everyday lookbook"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20"
    >
      <div className="group relative overflow-hidden rounded-3xl bg-blush shadow-sm">
        <div className="grid grid-cols-1 items-stretch md:grid-cols-12">
          {/* Photo */}
          <div className="relative aspect-16/10 w-full overflow-hidden sm:aspect-16/9 md:col-span-6 md:aspect-auto md:h-full md:min-h-[380px]">
            <Image
              src="/banners/bra-fit-model-banner.jpg"
              alt="KAYFIY everyday comfort wear"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Copy */}
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 md:col-span-6 lg:p-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-maroon/25 px-3.5 py-1 text-[10px] font-bold tracking-[0.18em] text-maroon uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-maroon" />
              The Lookbook
            </span>

            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl leading-tight font-bold tracking-tight text-charcoal sm:text-4xl lg:text-[2.75rem]">
              Softness that stays all day
            </h2>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Wire-free shapes, breathable cotton-modal and seams that lie flat
              under everything you already wear. Styled for real mornings, long
              commutes and evenings you would rather spend at home.
            </p>

            <div className="mt-7">
              <Link
                href="/collections/new-arrivals"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-cream uppercase transition-all duration-300 hover:bg-maroon-dark hover:shadow-lg"
              >
                <span>Shop the edit</span>
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
