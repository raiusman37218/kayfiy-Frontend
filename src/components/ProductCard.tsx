"use client";

import Image from "next/image";
import Link from "next/link";
import { slug, type Product } from "@/lib/data";
import { useWishlist } from "./useWishlist";
import { HeartIcon } from "./Icons";

// Helper to map color names to hex codes for Sajiero-style color swatches
function getColorHex(colorName: string): string {
  const c = colorName.toLowerCase().trim();
  if (c.includes("black") || c.includes("noir")) return "#1c1917";
  if (c.includes("skin") || c.includes("nude") || c.includes("beige") || c.includes("tan")) return "#e4be9e";
  if (c.includes("white") || c.includes("cream") || c.includes("ivory")) return "#fbf9f5";
  if (c.includes("maroon") || c.includes("wine") || c.includes("berry") || c.includes("plum")) return "#7a2a3d";
  if (c.includes("pink") || c.includes("blush") || c.includes("rose")) return "#f4aab9";
  if (c.includes("blue") || c.includes("navy")) return "#1e3a8a";
  if (c.includes("red") || c.includes("crimson")) return "#dc2626";
  if (c.includes("purple") || c.includes("lilac")) return "#9333ea";
  if (c.includes("green") || c.includes("mint") || c.includes("olive")) return "#15803d";
  if (c.includes("grey") || c.includes("gray")) return "#9ca3af";
  if (c.includes("brown") || c.includes("chocolate")) return "#78350f";
  if (c.includes("peach")) return "#fbcfe8";
  return "#d6d3d1";
}

export default function ProductCard({ product }: { product: Product }) {
  // Compute sale percentage like Sajiero (-25%)
  const onSale = typeof product.compareAt === "number" || product.bestsellere || product.new;
  const comparePrice =
    typeof product.compareAt === "number"
      ? product.compareAt
      : onSale
      ? Math.round((product.price * 1.35) / 100) * 100 - 1
      : null;

  const discountPercent =
    comparePrice && comparePrice > product.price
      ? Math.round(((comparePrice - product.price) / comparePrice) * 100)
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

  // Extract unique colors for swatches
  const displayColors = Array.from(
    new Set(
      (product.colors || [])
        .map((c) => c.trim())
        .filter((c) => c && c.toLowerCase() !== "default" && c.toLowerCase() !== "standard")
    )
  );

  return (
    <article className="group relative flex flex-col w-full h-full select-none transition-all duration-300">
      <Link
        href={`/products/${productSlug}`}
        className="flex flex-col w-full h-full block focus:outline-none"
        aria-label={product.name}
      >
        {/* ─── 4:5 PORTRAIT MEDIA CONTAINER (SAJIERO RATIO: 1080x1350) ─── */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#f6f5f3] transition-shadow duration-300 group-hover:shadow-md">
          {/* Primary Sharp High-Res Image */}
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={90}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Secondary Hover Image (Desktop only for smooth fade) */}
          {hoverSrc !== imgSrc && (
            <div className="hidden md:block absolute inset-0">
              <Image
                src={hoverSrc}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={90}
                className="object-cover object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
            </div>
          )}

          {/* Top-Left: Sajiero-Style Berry/Maroon Discount Badge (-25%) */}
          {discountPercent && discountPercent > 0 ? (
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 pointer-events-none">
              <span className="inline-flex items-center justify-center rounded sm:rounded-md bg-[#7A2A3D] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9.5px] sm:text-[11px] font-bold tracking-tight text-white shadow-xs">
                -{discountPercent}%
              </span>
            </div>
          ) : product.new ? (
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 pointer-events-none">
              <span className="inline-flex items-center justify-center rounded sm:rounded-md bg-charcoal px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold tracking-wider text-white shadow-xs uppercase">
                NEW
              </span>
            </div>
          ) : null}

          {/* Top-Right: Circular Floating Wishlist Heart */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-xs backdrop-blur-xs transition hover:bg-white hover:scale-110 active:scale-95 cursor-pointer"
          >
            <HeartIcon
              filled={wishlisted}
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
                wishlisted ? "text-[#7A2A3D]" : "text-neutral-600"
              }`}
            />
          </button>

          {/* Bottom Desktop Hover: Sajiero-Style Slide-Up "Select Options" Pill Button */}
          <div className="hidden lg:block absolute bottom-3 inset-x-3 z-10 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none">
            <span className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white/95 py-2.5 px-3 text-[11px] font-bold text-charcoal shadow-md backdrop-blur-xs transition hover:bg-[#7A2A3D] hover:text-white uppercase tracking-wider">
              <span>Select Options</span>
            </span>
          </div>

          {/* Bottom Mobile: Small Circular Shopping Bag Icon (Sajiero Mobile) */}
          <div className="lg:hidden absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-10 pointer-events-none">
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-sm backdrop-blur-xs">
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* ─── SAJIERO-STYLE CENTERED PRODUCT INFORMATION ─── */}
        <div className="mt-2.5 sm:mt-3 text-center flex flex-col items-center justify-start flex-1 px-1">
          {/* Title: Centered, clean font, 1-line truncate */}
          <h3
            className="w-full font-medium text-xs sm:text-[13px] md:text-sm text-neutral-900 leading-snug line-clamp-1 truncate group-hover:text-[#7A2A3D] transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Review Stars: Centered 5 Golden Stars (Sajiero Judge.me Style) */}
          <div className="mt-1 flex items-center justify-center gap-1" aria-label="5 out of 5 stars">
            <div className="flex text-amber-500 text-[10px] sm:text-xs tracking-tight">
              ★★★★★
            </div>
          </div>

          {/* Price Line: Bold Maroon Sale Price + Compare At Strikethrough */}
          <div className="mt-1 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-[13px] sm:text-sm md:text-[15px] font-bold text-[#7A2A3D]">
              Rs.{Number(product.price).toLocaleString("en-PK")}
            </span>
            {comparePrice && (
              <span className="text-[11px] sm:text-xs md:text-[13px] font-normal text-neutral-400 line-through">
                Rs.{Number(comparePrice).toLocaleString("en-PK")}
              </span>
            )}
          </div>

          {/* Color Swatches (Sajiero Style) */}
          {displayColors.length > 1 && (
            <div className="mt-1.5 flex items-center justify-center gap-1.5 flex-wrap">
              {displayColors.slice(0, 4).map((color, idx) => (
                <span
                  key={idx}
                  title={color}
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-neutral-300 shadow-2xs transition-transform hover:scale-125"
                  style={{ backgroundColor: getColorHex(color) }}
                />
              ))}
              {displayColors.length > 4 && (
                <span className="text-[9px] text-neutral-400 font-medium leading-none">
                  +{displayColors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
