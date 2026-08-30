"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronIcon } from "./Icons";
import type { Product } from "@/lib/data";

import type { BannerProp } from "@/lib/images";

type Props = {
  title: string;
  products: Product[];
  banner: BannerProp;
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

  const desktopSrc = typeof banner === "string" ? banner : banner.desktop;
  const mobileSrc = typeof banner === "string" ? undefined : banner.mobile;
  const altText =
    typeof banner !== "string" && banner.alt ? banner.alt : `${title} banner`;

  const aspectClasses =
    typeof banner !== "string" && banner.aspectRatio
      ? banner.aspectRatio
      : mobileSrc
        ? "aspect-[4/3] sm:aspect-[16/7] md:aspect-[8/3]"
        : "aspect-[8/3]";

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Pure Graphic Banner (Full width, natural aspect ratio, no cropping on mobile) */}
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          aria-label={`Shop ${title}`}
          className={`group relative block w-full ${aspectClasses} overflow-hidden rounded-3xl shadow-sm transition-all duration-500 hover:shadow-xl`}
        >
          {mobileSrc ? (
            <>
              {/* Mobile crop (< 768px) */}
              <Image
                src={mobileSrc}
                alt={altText}
                fill
                sizes="(min-width: 768px) 1px, 100vw"
                className="object-cover transition duration-700 group-hover:scale-102 md:hidden"
              />
              {/* Desktop crop (>= 768px) */}
              <Image
                src={desktopSrc}
                alt={altText}
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="hidden object-cover transition duration-700 group-hover:scale-102 md:block"
              />
            </>
          ) : (
            <Image
              src={desktopSrc}
              alt={altText}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover transition duration-700 group-hover:scale-102"
            />
          )}
        </Link>
      ) : (
        <div
          className={`relative w-full ${aspectClasses} overflow-hidden rounded-3xl shadow-sm`}
        >
          {mobileSrc ? (
            <>
              {/* Mobile crop (< 768px) */}
              <Image
                src={mobileSrc}
                alt={altText}
                fill
                sizes="(min-width: 768px) 1px, 100vw"
                className="object-cover md:hidden"
              />
              {/* Desktop crop (>= 768px) */}
              <Image
                src={desktopSrc}
                alt={altText}
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="hidden object-cover md:block"
              />
            </>
          ) : (
            <Image
              src={desktopSrc}
              alt={altText}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
          )}
        </div>
      )}

      {/* Clean Section Navigation Bar */}
      <div className="mt-6 mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-semibold">
            {title}
          </h2>
          {blurb && (
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {blurb}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="border-b border-rose/40 pb-0.5 text-xs tracking-[0.14em] text-[#C4526E] font-medium uppercase transition hover:border-[#C4526E]"
            >
              View All
            </Link>
          )}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label={`Scroll ${title} left`}
              className="rounded-full border border-line p-2 text-charcoal transition hover:border-[#C4526E] hover:text-[#C4526E] cursor-pointer"
            >
              <ChevronIcon className="h-4 w-4 rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label={`Scroll ${title} right`}
              className="rounded-full border border-line p-2 text-charcoal transition hover:border-[#C4526E] hover:text-[#C4526E] cursor-pointer"
            >
              <ChevronIcon className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Track */}
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
