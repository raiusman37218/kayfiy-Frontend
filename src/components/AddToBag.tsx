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
    <div className="mt-7 font-sans">
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

      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSize(option)}
            aria-pressed={size === option}
            className={`min-w-14 rounded-full border px-4 py-2 text-sm font-medium transition cursor-pointer ${
              size === option
                ? "border-[#7A2A3D] bg-[#7A2A3D] text-white shadow-xs"
                : "border-line bg-white text-black hover:border-black hover:bg-blush"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-line bg-white">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            disabled={!isAvailable}
            className="px-4 py-2.5 font-bold text-black transition hover:text-[#7A2A3D] disabled:opacity-40 cursor-pointer"
          >
            −
          </button>
          <span aria-live="polite" className="w-8 text-center text-sm font-bold text-black">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((value) => Math.min(10, value + 1))}
            aria-label="Increase quantity"
            disabled={!isAvailable}
            className="px-4 py-2.5 font-bold text-black transition hover:text-[#7A2A3D] disabled:opacity-40 cursor-pointer"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!isAvailable}
          className="flex-1 rounded-full bg-[#7A2A3D] px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-md transition hover:bg-[#5C1C2C] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-line disabled:text-muted-soft sm:flex-none cursor-pointer"
        >
          {isAvailable ? "Add to Bag" : "Out of Stock"}
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
