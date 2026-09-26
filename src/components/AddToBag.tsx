"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./useCart";
import SizeGuideModal from "./SizeGuideModal";
import { slug, type Product } from "@/lib/data";
import { sizesFor } from "@/lib/sizes";

// The size rules now live in @/lib/sizes so the server-rendered size
// calculator can share them; re-exported here for existing importers.
export { sizesFor };

export default function AddToBag({ product }: { product: Product }) {
  const sizes = sizesFor(product);
  const [size, setSize] = useState(sizes[0] || "Standard");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const isAvailable = product.instock !== false && (product.stockQuantity ?? 1) > 0;

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
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 4000);
  };

  return (
    <div className="mt-5 sm:mt-7 font-sans">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-bold tracking-wider text-black uppercase">
          Size
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/pages/bra-size-calculator"
            className="text-xs font-semibold text-[#7A2A3D] underline-offset-4 hover:underline"
          >
            Find my size
          </Link>
          <span className="text-line">|</span>
          <SizeGuideModal />
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-2">
        {sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSize(option)}
            aria-pressed={size === option}
            className={`min-w-12 sm:min-w-14 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition active:scale-95 cursor-pointer ${
              size === option
                ? "border-[#7A2A3D] bg-[#7A2A3D] text-white shadow-xs"
                : "border-line bg-white text-black hover:border-black hover:bg-blush"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Quantity & Stepper Row */}
      <div className="mt-5 sm:mt-6 flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-charcoal uppercase">
          Quantity
        </span>
        <div className="flex h-10 sm:h-11 items-center rounded-full border border-line bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            disabled={!isAvailable}
            className="px-3.5 py-1 text-base font-bold text-charcoal transition hover:text-[#7A2A3D] active:scale-90 disabled:opacity-40 cursor-pointer"
          >
            −
          </button>
          <span aria-live="polite" className="w-8 text-center text-sm font-bold text-charcoal">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((value) => Math.min(10, value + 1))}
            aria-label="Increase quantity"
            disabled={!isAvailable}
            className="px-3.5 py-1 text-base font-bold text-charcoal transition hover:text-[#7A2A3D] active:scale-90 disabled:opacity-40 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Main Full-Width Add to Bag Button (Centered, Symmetrical, Sajiero Style) */}
      <div className="mt-3.5 sm:mt-4 w-full">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!isAvailable}
          className="w-full h-12 sm:h-13 flex items-center justify-center gap-2 rounded-full bg-[#7A2A3D] px-6 sm:px-8 text-xs sm:text-sm font-bold tracking-[0.14em] text-white uppercase shadow-md transition-all duration-300 hover:bg-[#5C1C2C] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted-soft cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>{isAvailable ? "Add to Bag" : "Out of Stock"}</span>
        </button>
      </div>

      {added && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-[#FAE8EC] border border-[#EDC9D0] px-4 py-3 text-xs font-medium text-black">
          <span>✓ Added to your bag.</span>
          <Link href="/cart" className="font-bold text-[#7A2A3D] underline underline-offset-4">
            View bag
          </Link>
          <span>•</span>
          <Link
            href="/checkout"
            className="font-bold text-[#7A2A3D] underline underline-offset-4"
          >
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
