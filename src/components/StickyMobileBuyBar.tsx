"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "./useCart";
import { formatPrice, slug, type Product } from "@/lib/data";
import { sizesFor } from "@/lib/sizes";

export default function StickyMobileBuyBar({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const sizes = sizesFor(product);
  const [size, setSize] = useState(sizes[0] || "Standard");
  const { add } = useCart();

  const isAvailable = product.instock !== false && (product.stockQuantity ?? 1) > 0;
  const onSale = typeof product.compareAt === "number";

  useEffect(() => {
    function handleScroll() {
      // Show when scrolled past 400px
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdd = () => {
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
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 block border-t border-line bg-white/95 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-300 sm:hidden animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        {/* Thumbnail & Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-blush border border-line">
            <Image
              src={product.image || "/banners/hero-monsoon.jpg"}
              alt={product.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs font-semibold text-charcoal">
              {product.name}
            </h4>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-xs font-extrabold ${onSale ? "text-[#7A2A3D]" : "text-black"}`}>
                {formatPrice(product.price)}
              </span>
              {onSale && (
                <span className="text-[10px] text-muted line-through">
                  {formatPrice(product.compareAt!)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Size Selection (if multiple) & Add to Cart button */}
        <div className="flex items-center gap-2 shrink-0">
          {sizes.length > 1 && (
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              aria-label="Select size"
              className="h-10 rounded-full border border-line bg-cream px-2.5 text-xs font-semibold text-charcoal focus:border-[#7A2A3D] focus:outline-none"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`h-10 rounded-full px-5 text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-sm ${
              added
                ? "bg-emerald-600 text-white"
                : isAvailable
                ? "bg-[#7A2A3D] text-white hover:bg-[#5C1C2C]"
                : "bg-line text-muted cursor-not-allowed"
            }`}
          >
            {added ? "✓ Added" : isAvailable ? "Add to Bag" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
