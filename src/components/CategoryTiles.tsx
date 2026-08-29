import Image from "next/image";
import Link from "next/link";
import { heroBanners } from "@/lib/data";

export default function CategoryTiles() {
  return (
    <section
      aria-label="Shop by category"
      className="mx-auto max-w-7xl px-4 pt-12 pb-2 sm:px-6"
    >
      <h2 className="text-center font-serif text-2xl tracking-wide text-charcoal sm:text-3xl">
        Shop by Category
      </h2>
      <p className="mx-auto mt-2 mb-8 max-w-md text-center text-sm text-muted">
        Start where you need us most.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {heroBanners.map((banner) => (
          <Link
            key={banner.label}
            href={banner.href}
            className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-blush shadow-sm transition duration-300 hover:shadow-[0_22px_44px_-24px_rgba(43,39,36,0.5)] sm:aspect-[3/4]"
          >
            <Image
              src={banner.image}
              alt={banner.label}
              fill
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-cream">
              <h3 className="font-serif text-2xl leading-tight">
                {banner.label}
              </h3>
              <p className="mt-1 text-xs tracking-[0.12em] uppercase opacity-90">
                {banner.caption}
              </p>
              <span className="mt-3 inline-block border-b border-cream/70 pb-0.5 text-[11px] tracking-[0.16em] uppercase">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
