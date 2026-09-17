"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { discountPercent, formatPrice, slug, type Product } from "@/lib/data";
import { useCart } from "./useCart";
import { useWishlist } from "./useWishlist";
import { HeartIcon } from "./Icons";
import { sizesFor } from "./AddToBag";

const SIZES =
  "(min-width: 1280px) 19vw, (min-width: 1024px) 23vw, (min-width: 768px) 30vw, (min-width: 640px) 38vw, 62vw";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = typeof product.compareAt === "number";
  const { add } = useCart();
  const wishlist = useWishlist();
  const productSlug = slug(product.name);
  const wishlisted = wishlist.has(productSlug);
  const [addedSize, setAddedSize] = useState<string | null>(null);

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

  const isAvailable = product.instock !== false && (product.stockQuantity ?? 1) > 0;
  const availableSizes = sizesFor(product).slice(0, 5); // display up to 5 quick sizes

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

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    add(
      {
        id: product.id,
        slug: slug(product.name),
        name: product.name,
        price: product.price,
        image: product.image,
        size,
      },
      1,
    );
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1800);
  };

  return (
    <article className="group relative flex flex-col">
      <Link href={`/products/${slug(product.name)}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl bg-blush shadow-xs transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_-20px_rgba(43,39,36,0.3)]">
          {/* Primary & Hover Images */}
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes={SIZES}
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={hoverSrc}
            alt=""
            aria-hidden
            fill
            sizes={SIZES}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* Top Left Badges */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1.5 items-start">
            {onSale && (
              <span className="rounded-full bg-[#7A2A3D] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-[0.14em] text-white uppercase shadow-xs">
                Sale
              </span>
            )}
            {product.bestsellere && (
              <span className="rounded-full bg-charcoal/90 backdrop-blur-xs px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] text-gold uppercase shadow-xs">
                Bestseller
              </span>
            )}
            {product.new && !onSale && (
              <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] text-white uppercase shadow-xs">
                New
              </span>
            )}
          </div>

          {/* Top Right Badges & Wishlist */}
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 flex flex-col items-end gap-1.5">
            {onSale && (
              <span className="rounded-full bg-white/95 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-tight text-charcoal shadow-xs backdrop-blur-xs">
                -{discountPercent(product.price, product.compareAt!)}%
              </span>
            )}
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              className="rounded-full bg-white/90 p-2 shadow-xs backdrop-blur-xs transition hover:bg-white hover:scale-110 cursor-pointer"
            >
              <HeartIcon
                filled={wishlisted}
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
                  wishlisted ? "text-[#7A2A3D]" : "text-charcoal"
                }`}
              />
            </button>
          </div>

          {/* Quick Size Selector Slide-up Overlay */}
          {isAvailable && (
            <div className="absolute inset-x-0 bottom-0 z-20 bg-charcoal/92 backdrop-blur-md p-2.5 text-center transition-all duration-300 translate-y-full group-hover:translate-y-0">
              {addedSize ? (
                <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-bold text-emerald-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added {addedSize} to Bag!</span>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Quick Add Size
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={(e) => handleQuickAdd(e, size)}
                        className="rounded-md bg-white/20 px-2 py-1 text-[10px] font-bold text-white transition hover:bg-white hover:text-charcoal cursor-pointer active:scale-95"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="mt-3">
          {/* Subtle Star Rating & Category */}
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span className="uppercase tracking-[0.12em] text-[10px] font-semibold text-muted/80">
              {product.category || "Innerwear"}
            </span>
            <span className="flex items-center gap-1 text-gold font-bold text-[10px]">
              <span>★</span>
              <span>4.9</span>
            </span>
          </div>

          <h3 className="mt-1 line-clamp-2 text-xs sm:text-sm font-medium text-charcoal transition group-hover:text-[#7A2A3D]">
            {product.name}
          </h3>

          <div className="mt-1.5 flex items-baseline gap-2 text-xs sm:text-sm">
            <span className={`font-bold ${onSale ? "text-[#7A2A3D]" : "text-charcoal"}`}>
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-[11px] sm:text-xs text-muted-soft line-through">
                {formatPrice(product.compareAt!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
