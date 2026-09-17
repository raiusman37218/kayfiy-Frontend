import Image from "next/image";
import Link from "next/link";
import { heroBanners as defaultBanners } from "@/lib/data";
import { fetchDbCategories, fetchDbProducts } from "@/lib/supabase";
import { BRA_IMAGES, NIGHTWEAR_IMAGES } from "@/lib/images";

export default async function CategoryTiles() {
  const [dbCategories, dbProducts] = await Promise.all([
    fetchDbCategories().catch(() => []),
    fetchDbProducts().catch(() => []),
  ]);

  const activeProducts = dbProducts.filter((p) => p.instock !== false);
  const brasCount = activeProducts.filter(
    (p) => p.category?.toLowerCase() === "bras" || /bra/i.test(p.name)
  ).length;
  const pjCount = activeProducts.filter(
    (p) =>
      p.category?.toLowerCase() === "pj sets" ||
      p.category?.toLowerCase() === "nightwear" ||
      /pj|pyjama|night/i.test(p.name)
  ).length;

  type BannerItem = {
    label: string;
    caption: string;
    href: string;
    image: string;
    countBadge?: string;
  };

  let banners: BannerItem[] = defaultBanners.map((b) => ({
    ...b,
    countBadge:
      b.label === "Bras"
        ? `${brasCount || 15} Styles In Stock`
        : `${pjCount || 4} Styles In Stock`,
  }));

  if (dbCategories && dbCategories.length > 0) {
    banners = dbCategories.map((cat) => {
      const isBras = cat.slug === "bras";
      const isPj = cat.slug === "pj-sets";
      const count = isBras ? brasCount || 15 : isPj ? pjCount || 4 : 0;
      const fallbackImage = isPj ? NIGHTWEAR_IMAGES[0] : BRA_IMAGES[0];

      return {
        label: cat.name,
        caption: cat.description || (isBras ? "Sizes 30A to 44DD — Wire-free & Padded" : "Silk & Breathable Cotton Sets"),
        countBadge: `${count} Styles In Stock`,
        href: `/collections/${cat.slug}`,
        image: cat.image || fallbackImage,
      };
    });
  }

  return (
    <section
      aria-label="Shop by category"
      className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:pt-16"
    >
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <span className="inline-block rounded-full bg-[#FAF0F2] px-3.5 py-1 text-[11px] font-bold tracking-[0.16em] text-[#7A2A3D] uppercase border border-[#EDC9D0]">
          Curated Essentials
        </span>
        <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl tracking-tight text-charcoal sm:text-3xl lg:text-4xl font-bold">
          Shop Our Active Collections
        </h2>
        <p className="mt-2 text-sm text-muted">
          Designed for maximum everyday ease, breathable fit, and luxury comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto">
        {banners.map((banner) => (
          <Link
            key={banner.label}
            href={banner.href}
            className="group relative block aspect-[4/4.8] sm:aspect-[4/5] overflow-hidden rounded-3xl bg-blush shadow-md transition-all duration-500 hover:shadow-2xl hover:scale-[1.015]"
          >
            <Image
              src={banner.image}
              alt={banner.label}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-106"
            />
            {/* Rich gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />

            {/* Top In-Stock Pill */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wider text-[#7A2A3D] backdrop-blur-md shadow-xs uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7A2A3D] animate-pulse" />
                {banner.countBadge || "In Stock"}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#FAEDEF] transition">
                {banner.label}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-white/85 tracking-wide line-clamp-2">
                {banner.caption}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 border-b-2 border-gold pb-1 text-xs font-bold tracking-[0.16em] uppercase text-white transition-all group-hover:border-white">
                <span>Explore Collection</span>
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
