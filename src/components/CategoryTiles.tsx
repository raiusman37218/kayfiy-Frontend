import Image from "next/image";
import Link from "next/link";
import { heroBanners as defaultBanners } from "@/lib/data";
import { fetchDbCategories } from "@/lib/supabase";
import { BRA_IMAGES, SET_IMAGES, NIGHTWEAR_IMAGES, PANTY_IMAGES } from "@/lib/images";

const DEFAULT_IMAGES = [
  BRA_IMAGES[0],
  SET_IMAGES[0],
  NIGHTWEAR_IMAGES[0],
  PANTY_IMAGES[0],
];

export default async function CategoryTiles() {
  const dbCategories = await fetchDbCategories();

  let banners = defaultBanners;

  if (dbCategories && dbCategories.length >= 4) {
    banners = dbCategories.slice(0, 4).map((cat, idx) => ({
      label: cat.name,
      caption: cat.description || "Discover collection",
      href: `/collections/${cat.slug}`,
      image: cat.image || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length],
    }));
  }

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

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {banners.map((banner) => (
          <Link
            key={banner.label}
            href={banner.href}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl bg-blush shadow-sm transition-all duration-500 hover:shadow-lg hover:scale-[1.02] sm:aspect-[3/4] lg:aspect-[3/3.8]"
          >
            <Image
              src={banner.image}
              alt={banner.label}
              fill
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-106"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-cream">
              <h3 className="font-serif text-base sm:text-xl lg:text-2xl font-semibold leading-tight">
                {banner.label}
              </h3>
              <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs tracking-[0.1em] uppercase opacity-90 truncate">
                {banner.caption}
              </p>
              <span className="mt-1.5 sm:mt-2.5 inline-block border-b border-cream/70 pb-0.5 text-[10px] sm:text-[11px] tracking-[0.14em] uppercase font-medium">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
