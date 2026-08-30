"use client";

import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice, slug, type Product } from "@/lib/data";
import { useCart } from "./useCart";
import { sizesFor } from "./AddToBag";

const SIZES =
  "(min-width: 1280px) 19vw, (min-width: 1024px) 23vw, (min-width: 768px) 30vw, (min-width: 640px) 38vw, 62vw";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = typeof product.compareAt === "number";
  const { add } = useCart();

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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    const sizes = sizesFor(product);
    add(
      {
        id: product.id,
        slug: slug(product.name),
        name: product.name,
        price: product.price,
        image: product.image,
        size: sizes[0] || "Standard",
      },
      1,
    );
  };

  return (
    <article className="group">
      <Link href={`/products/${slug(product.name)}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush shadow-sm transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_-20px_rgba(43,39,36,0.4)]">
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

          {onSale && (
            <span className="absolute top-3 left-3 rounded-full bg-[#C4526E] px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase shadow-sm animate-pulse-soft">
              Sale
            </span>
          )}
          {onSale && (
            <span className="absolute top-3 right-3 rounded-full bg-cream/90 px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] text-charcoal backdrop-blur-sm shadow-sm">
              -{discountPercent(product.price, product.compareAt!)}%
            </span>
          )}

          {/* Quick Add Button — appears on hover */}
          {isAvailable && (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-1.5 bg-charcoal/90 backdrop-blur-sm py-3 text-[11px] font-bold tracking-wider text-white uppercase translate-y-full transition-all duration-300 group-hover:translate-y-0 hover:bg-[#C4526E] cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Quick Add
            </button>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-medium text-charcoal transition group-hover:text-[#C4526E]">
          {product.name}
        </h3>

        <p className="mt-1 flex items-baseline gap-2 text-sm">
          <span className={`font-bold ${onSale ? "text-[#C4526E]" : "text-charcoal"}`}>
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compareAt!)}
            </span>
          )}
        </p>
      </Link>
    </article>
  );
}
