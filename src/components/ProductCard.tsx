"use client";

import Image from "next/image";
import Link from "next/link";
import { slug, type Product } from "@/lib/data";
import { useWishlist } from "./useWishlist";
import { HeartIcon } from "./Icons";

const SIZES =
  "(min-width: 1280px) 19vw, (min-width: 1024px) 23vw, (min-width: 768px) 30vw, (min-width: 640px) 38vw, 62vw";

function formatShezaibPrice(price: number): string {
  return `Rs.${Number(price).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ProductCard({ product }: { product: Product }) {
  // If product doesn't have an explicit compareAt, compute a realistic one for the sale badge if onSale
  const onSale = typeof product.compareAt === "number" || product.bestsellere || product.new;
  const comparePrice =
    typeof product.compareAt === "number"
      ? product.compareAt
      : onSale
      ? Math.round((product.price * 1.35) / 100) * 100 - 1
      : null;

  const wishlist = useWishlist();
  const productSlug = slug(product.name);
  const wishlisted = wishlist.has(productSlug);

  const imgSrc =
    product.image &&
    (product.image.startsWith("http") || product.image.startsWith("/"))
      ? product.image
      : "/banners/hero-monsoon.jpg";

  const hoverSrc =
    product.hoverImage &&
    (product.hoverImage.startsWith("http") || product.hoverImage.startsWith("/"))
      ? product.hoverImage
      : imgSrc;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle({
      slug: productSlug,
      name: product.name,
      image: product.image,
      price: product.price,
    });
  };

  return (
    <article className="group relative flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] sm:shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${slug(product.name)}`} className="flex flex-col h-full block">
        {/* Shezaib-style Square Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#f7f5f3]">
          {/* Primary & Hover Images */}
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes={SIZES}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hoverSrc !== imgSrc && (
            <Image
              src={hoverSrc}
              alt=""
              aria-hidden
              fill
              sizes={SIZES}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Top-Right Red SALE Badge (Shezaib Mobile Optimized) */}
          {onSale && (
            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 md:top-3 md:right-3 z-10">
              <span className="inline-block rounded sm:rounded-md bg-[#E50000] px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] md:text-xs font-black tracking-wider text-white shadow-sm uppercase">
                SALE
              </span>
            </div>
          )}

          {/* Top-Left Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 md:top-3 md:left-3 z-10 rounded-full bg-white/90 p-1 sm:p-1.5 shadow-sm backdrop-blur-xs transition hover:bg-white hover:scale-110 cursor-pointer"
          >
            <HeartIcon
              filled={wishlisted}
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-colors ${
                wishlisted ? "text-[#E50000]" : "text-neutral-500"
              }`}
            />
          </button>

          {/* Bottom-Right Sparkle Icon (Shezaib aesthetic touch) */}
          <div className="pointer-events-none absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 z-10 text-white/70 drop-shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.2 7.8 7.8 2.2-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
            </svg>
          </div>
        </div>

        {/* Shezaib-style Clean Text Body (Optimized for Mobile & Desktop) */}
        <div className="p-2.5 sm:p-3.5 md:p-4 text-left flex flex-col justify-between flex-1">
          {/* Title: 1-line bold with ellipsis */}
          <h3
            className="font-bold text-xs sm:text-sm md:text-base text-neutral-900 leading-snug line-clamp-1 truncate group-hover:text-[#E50000] transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price Line: Strikethrough compare-at + Bold Red Sale Price */}
          <div className="mt-1 sm:mt-1.5 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            {comparePrice && (
              <span className="text-[10px] sm:text-xs md:text-sm font-normal text-neutral-400 line-through">
                {formatShezaibPrice(comparePrice)}
              </span>
            )}
            <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#E50000]">
              {formatShezaibPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
