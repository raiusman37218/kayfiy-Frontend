"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronIcon } from "./Icons";
import type { Product } from "@/lib/data";

type Props = {
  title: string;
  products: Product[];
  banner: string;
  blurb: string;
  viewAllHref?: string;
};

export default function ProductCarousel({
  title,
  products,
  banner,
  blurb,
  viewAllHref,
}: Props) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      {/* Section banner — tells you at a glance what you are looking at */}
      <div className="relative h-36 overflow-hidden rounded-3xl sm:h-44 lg:h-52">
        <Image
          src={banner}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/35 to-transparent" />
        <div className="relative flex h-full flex-col justify-center px-6 text-cream sm:px-10">
          <h2 className="font-serif text-3xl tracking-wide sm:text-4xl">
            {title}
          </h2>
          <p className="mt-1 max-w-sm text-xs tracking-[0.08em] uppercase opacity-90 sm:text-sm sm:normal-case sm:tracking-normal">
            {blurb}
          </p>
        </div>
      </div>

      <div className="mt-5 mb-5 flex items-center justify-end gap-3">
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="mr-auto border-b border-rose/40 pb-0.5 text-xs tracking-[0.14em] text-rose uppercase transition hover:border-rose sm:mr-0"
          >
            View All
          </Link>
        )}
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${title} left`}
            className="rounded-full border border-line p-2 text-charcoal transition hover:border-rose hover:text-rose"
          >
            <ChevronIcon className="h-4 w-4 rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${title} right`}
            className="rounded-full border border-line p-2 text-charcoal transition hover:border-rose hover:text-rose"
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
            className="w-[62%] shrink-0 snap-start sm:w-[38%] md:w-[30%] lg:w-[23%] xl:w-[19%]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
