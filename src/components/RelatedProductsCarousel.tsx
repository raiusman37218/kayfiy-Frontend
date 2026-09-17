"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronIcon } from "./Icons";
import type { Product } from "@/lib/data";

export default function RelatedProductsCarousel({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal">
          {title}
        </h2>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${title} left`}
            className="rounded-full border border-line p-2 text-charcoal transition hover:border-[#7A2A3D] hover:text-[#7A2A3D] cursor-pointer"
          >
            <ChevronIcon className="h-4 w-4 rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${title} right`}
            className="rounded-full border border-line p-2 text-charcoal transition hover:border-[#7A2A3D] hover:text-[#7A2A3D] cursor-pointer"
          >
            <ChevronIcon className="h-4 w-4 -rotate-90" />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="w-[62%] shrink-0 snap-start sm:w-[38%] md:w-[30%] lg:w-[23%]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
