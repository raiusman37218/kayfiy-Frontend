"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronIcon } from "./Icons";
import { slug, type Product } from "@/lib/data";
import type { BannerProp } from "@/lib/images";

type Props = {
  title: string;
  products: Product[];
  banner?: BannerProp;
  blurb?: string;
  viewAllHref?: string;
  tabs?: string[];
  tone?: "plain" | "soft";
  className?: string;
};

export default function ProductCarousel({
  title,
  products,
  banner,
  blurb,
  viewAllHref,
  tabs,
  tone = "plain",
  className = "",
}: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeTab, setActiveTab] = useState(tabs && tabs.length > 0 ? tabs[0] : "All");

  const desktopSrc = banner
    ? typeof banner === "string"
      ? banner
      : banner.desktop
    : undefined;
  const mobileSrc =
    banner && typeof banner !== "string" ? banner.mobile : undefined;
  const altText =
    banner && typeof banner !== "string" && banner.alt
      ? banner.alt
      : `${title} banner`;

  const aspectClasses =
    banner && typeof banner !== "string" && banner.aspectRatio
      ? banner.aspectRatio
      : mobileSrc
        ? "aspect-[4/3] sm:aspect-[16/7] md:aspect-[8/3]"
        : "aspect-[8/3]";

  // Filter products if tabs are used
  const filteredProducts =
    tabs && activeTab !== "All"
      ? products.filter((p) => {
          const query = activeTab.toLowerCase();
          const querySlug = slug(activeTab);
          const pSub = (p.subcategory || "").toLowerCase();
          const pCat = (p.category || "").toLowerCase();
          return (
            pSub === query ||
            pSub === querySlug ||
            slug(pSub) === querySlug ||
            pCat === query ||
            slug(pCat) === querySlug ||
            p.name.toLowerCase().includes(query)
          );
        })
      : products;

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-label={title}
      className={`${tone === "soft" ? "bg-blush/40" : ""} ${className}`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 ${
          banner ? "py-10 sm:py-14" : "py-8 sm:py-10 lg:py-12"
        } sm:px-6`}
      >
        {/* Optional Graphic Banner */}
        {banner && desktopSrc && (
          <div className="mb-6 sm:mb-8">
            {viewAllHref ? (
              <Link
                href={viewAllHref}
                aria-label={`Shop ${title}`}
                className={`group relative block w-full ${aspectClasses} overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm transition-all duration-500 hover:shadow-xl`}
              >
                {mobileSrc ? (
                  <>
                    <Image
                      src={mobileSrc}
                      alt={altText}
                      fill
                      sizes="(min-width: 768px) 1px, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-102 md:hidden"
                    />
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
                className={`relative w-full ${aspectClasses} overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm`}
              >
                {mobileSrc ? (
                  <>
                    <Image
                      src={mobileSrc}
                      alt={altText}
                      fill
                      sizes="(min-width: 768px) 1px, 100vw"
                      className="object-cover md:hidden"
                    />
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
          </div>
        )}

        {/* Centered Section Header */}
        <div className="relative mb-6 sm:mb-8 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-charcoal">
            {title}
          </h2>
          {blurb && (
            <p className="mx-auto mt-1 max-w-xl text-xs sm:text-sm text-muted">
              {blurb}
            </p>
          )}
          <div className="mx-auto mt-2.5 h-0.5 w-12 bg-gradient-to-r from-transparent via-[#7A2A3D] to-transparent" />

          {/* Desktop View All link */}
          {viewAllHref && (
            <div className="hidden sm:block absolute right-0 bottom-0.5">
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-1 border-b border-rose/40 pb-0.5 text-xs tracking-[0.14em] text-[#7A2A3D] font-semibold uppercase transition hover:border-[#7A2A3D]"
              >
                <span>View All</span>
                <ChevronIcon className="h-3 w-3 -rotate-90" />
              </Link>
            </div>
          )}
        </div>

        {/* Optional Filter Tabs */}
        {tabs && tabs.length > 1 && (
          <div className="mb-5 no-scrollbar -mx-4 flex justify-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#7A2A3D] text-white shadow-xs"
                    : "bg-white/80 text-charcoal border border-line hover:border-[#7A2A3D] hover:text-[#7A2A3D]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Products Track with Floating Left / Right Chevrons */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${title} left`}
            className="absolute -left-2 sm:-left-4 top-[40%] -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-charcoal shadow-xl border border-neutral-200 transition-all duration-300 hover:bg-[#7A2A3D] hover:text-white hover:border-[#7A2A3D] hover:scale-110 cursor-pointer active:scale-95"
          >
            <ChevronIcon className="h-4 w-4 sm:h-5 sm:w-5 rotate-90" />
          </button>

          <ul
            ref={trackRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 sm:gap-4 overflow-x-auto scroll-smooth px-4 pb-3 sm:mx-0 sm:px-0"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="w-[46%] shrink-0 snap-start sm:w-[32%] md:w-[28%] lg:w-[22%] xl:w-[18.5%]"
                >
                  <ProductCard product={product} />
                </li>
              ))
            ) : (
              <li className="w-full py-8 text-center text-sm text-muted">
                No items in this category currently.
              </li>
            )}
          </ul>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${title} right`}
            className="absolute -right-2 sm:-right-4 top-[40%] -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-charcoal shadow-xl border border-neutral-200 transition-all duration-300 hover:bg-[#7A2A3D] hover:text-white hover:border-[#7A2A3D] hover:scale-110 cursor-pointer active:scale-95"
          >
            <ChevronIcon className="h-4 w-4 sm:h-5 sm:w-5 -rotate-90" />
          </button>
        </div>

        {/* Centered Mobile View All Link */}
        {viewAllHref && (
          <div className="mt-5 text-center sm:hidden">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 border-b border-rose/40 pb-0.5 text-xs tracking-[0.14em] text-[#7A2A3D] font-semibold uppercase transition hover:border-[#7A2A3D]"
            >
              <span>View All {title}</span>
              <ChevronIcon className="h-3 w-3 -rotate-90" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
