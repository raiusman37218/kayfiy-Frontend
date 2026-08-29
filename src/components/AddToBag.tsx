"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./useCart";
import { slug, type Product } from "@/lib/data";

const BRA_SIZES = ["32B", "34B", "34C", "36B", "36C", "38C", "40D", "42D"];
const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
const ONE_SIZE = ["One size"];

export function sizesFor(product: Product) {
  if (product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Standard") {
    return product.sizes;
  }
  // Word boundaries matter here — "Padded Bra" must not read as a pack of pads.
  if (/\bpads?\b|\bliners\b|\bbox\b/i.test(product.name)) return ONE_SIZE;
  if (/belt/i.test(product.name)) return APPAREL_SIZES;
  if (/bra\b|bralette|push-up|t-shirt/i.test(product.name)) return BRA_SIZES;
  return APPAREL_SIZES;
}

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
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <p className="text-xs tracking-[0.16em] text-charcoal uppercase">
          Size
        </p>
        <Link
          href="/pages/bra-size-calculator"
          className="text-xs text-rose underline-offset-4 hover:underline"
        >
          Find my size
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSize(option)}
            aria-pressed={size === option}
            className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${
              size === option
                ? "border-charcoal bg-charcoal text-cream"
                : "border-line text-charcoal hover:border-rose hover:text-rose"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-line">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            disabled={!isAvailable}
            className="px-4 py-2.5 text-charcoal transition hover:text-rose disabled:opacity-40"
          >
            −
          </button>
          <span aria-live="polite" className="w-8 text-center text-sm">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((value) => Math.min(10, value + 1))}
            aria-label="Increase quantity"
            disabled={!isAvailable}
            className="px-4 py-2.5 text-charcoal transition hover:text-rose disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!isAvailable}
          className="flex-1 rounded-full bg-charcoal px-8 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:flex-none"
        >
          {isAvailable ? "Add to Bag" : "Out of Stock"}
        </button>
      </div>

      {added && (
        <p className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-blush px-4 py-3 text-sm text-charcoal">
          Added to your bag.
          <Link href="/cart" className="text-rose underline underline-offset-4">
            View bag
          </Link>
          <Link
            href="/checkout"
            className="text-rose underline underline-offset-4"
          >
            Checkout
          </Link>
        </p>
      )}
    </div>
  );
}
