"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DbCategory } from "@/lib/supabase";
import {
  BRA_IMAGES,
  SET_IMAGES,
  NIGHTWEAR_IMAGES,
  PANTY_IMAGES,
  SHAPEWEAR_IMAGES,
} from "@/lib/images";

export interface CategoryStory {
  name: string;
  slug: string;
  href: string;
  image: string;
  badge?: string;
}

const EXCLUDED_SLUGS = new Set([
  "new-arrivals",
  "new-arrival",
  "best-sellers",
  "best-seller",
  "top-selling",
  "top-sellers",
  "sale",
  "sale-deals",
  "budget-deals",
  "budget-deal",
  "all",
]);

const EXCLUDED_NAMES = new Set([
  "new arrivals",
  "new arrival",
  "best sellers",
  "best seller",
  "top selling",
  "top sellers",
  "sale",
  "sale deals",
  "budget deals",
  "budget deal",
  "all",
  "all products",
]);

const DEFAULT_STORIES: CategoryStory[] = [
  {
    name: "Bras",
    slug: "bras",
    href: "/collections/bras",
    image: BRA_IMAGES[0] || "/images/bra-lace-black.jpg",
  },
  {
    name: "Bra Sets",
    slug: "bra-sets",
    href: "/collections/bra-sets",
    image: SET_IMAGES[0] || "/images/bras-assorted.jpg",
  },
  {
    name: "Panties",
    slug: "panties",
    href: "/collections/panties",
    image: PANTY_IMAGES[0] || "/images/brief-cream-lace.jpg",
  },
  {
    name: "Nightwear",
    slug: "nightwear",
    href: "/collections/nightwear",
    image: NIGHTWEAR_IMAGES[0] || "/images/pyjama-pink.jpg",
  },
  {
    name: "Pj Sets",
    slug: "pj-sets",
    href: "/collections/pj-sets",
    image: NIGHTWEAR_IMAGES[1] || "/images/pyjama-blue.jpg",
  },
  {
    name: "Shapewear",
    slug: "shapewear",
    href: "/collections/shapewear",
    image: SHAPEWEAR_IMAGES[0] || "/images/camisoles-stack.jpg",
  },
  {
    name: "Sanitary Pads",
    slug: "sanitary-pads",
    href: "/collections/sanitary-pads",
    image: PANTY_IMAGES[1] || "/images/brief-black-cotton.jpg",
  },
  {
    name: "Maternity",
    slug: "maternity",
    href: "/collections/maternity",
    image: BRA_IMAGES[2] || "/images/bras-assorted.jpg",
  },
  {
    name: "Plus Size",
    slug: "plus-size",
    href: "/collections/plus-size",
    image: BRA_IMAGES[1] || "/images/bra-white-knit.jpg",
  },
];

function fallbackImageForSlug(slug: string, index: number): string {
  const s = slug.toLowerCase();
  if (s.includes("set")) return SET_IMAGES[index % SET_IMAGES.length] || SET_IMAGES[0];
  if (s.includes("night") || s.includes("pj") || s.includes("sleep"))
    return NIGHTWEAR_IMAGES[index % NIGHTWEAR_IMAGES.length] || NIGHTWEAR_IMAGES[0];
  if (s.includes("panty") || s.includes("panties") || s.includes("brief"))
    return PANTY_IMAGES[index % PANTY_IMAGES.length] || PANTY_IMAGES[0];
  if (s.includes("shape") || s.includes("cinch") || s.includes("suit"))
    return SHAPEWEAR_IMAGES[index % SHAPEWEAR_IMAGES.length] || SHAPEWEAR_IMAGES[0];
  if (s.includes("pad")) return PANTY_IMAGES[1] || "/images/brief-black-cotton.jpg";
  return BRA_IMAGES[index % BRA_IMAGES.length] || BRA_IMAGES[0];
}

export interface CategoryStoriesProps {
  categories?: DbCategory[];
}

export default function CategoryStories({ categories }: CategoryStoriesProps) {
  const stories: CategoryStory[] = (() => {
    if (categories && categories.length > 0) {
      const mainCats = categories
        .filter(
          (cat) =>
            !cat.parent_slug &&
            cat.show_on_homepage !== false &&
            !EXCLUDED_SLUGS.has(cat.slug.toLowerCase().trim()) &&
            !EXCLUDED_NAMES.has(cat.name.toLowerCase().trim())
        )
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      if (mainCats.length > 0) {
        return mainCats.map((cat, idx) => ({
          name: cat.name,
          slug: cat.slug,
          href: `/collections/${cat.slug}`,
          image:
            cat.image &&
            !cat.image.includes("bustaniya-campaign-hero") &&
            (cat.image.startsWith("http") || cat.image.startsWith("/"))
              ? cat.image
              : fallbackImageForSlug(cat.slug, idx),
        }));
      }
    }
    return DEFAULT_STORIES;
  })();

  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const itemsPerViewDesktop = 5;
  const maxDesktopIndex = Math.max(0, stories.length - itemsPerViewDesktop);

  const handleNextDesktop = useCallback(() => {
    setDesktopIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
  }, [maxDesktopIndex]);

  const handlePrevDesktop = useCallback(() => {
    setDesktopIndex((prev) => (prev <= 0 ? maxDesktopIndex : prev - 1));
  }, [maxDesktopIndex]);

  // Autoplay only on desktop screen sizes (window width >= 768px)
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    const timer = setInterval(() => {
      handleNextDesktop();
    }, 4000);
    return () => clearInterval(timer);
  }, [handleNextDesktop]);

  return (
    <section
      aria-label="Shop by category"
      className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 select-none"
    >
      {/* Centered Section Header */}
      <div className="mb-4 sm:mb-8 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-charcoal">
          Shop by Category
        </h2>
        <div className="mx-auto mt-2 h-0.5 w-12 bg-gradient-to-r from-transparent via-[#7A2A3D] to-transparent" />
      </div>

      {/* ─── MOBILE VIEW: Native 60fps Hardware-Accelerated Touch Track (< sm) ─── */}
      <div
        ref={mobileTrackRef}
        className="sm:hidden no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory touch-pan-x"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {stories.map((story) => (
          <div
            key={story.slug}
            className="w-[145px] xs:w-[160px] shrink-0 snap-start"
          >
            <Link
              href={story.href}
              className="flex flex-col w-full h-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#ECE5E5] transition-transform active:scale-[0.98]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F9F5F3]">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 via-black/5 to-transparent pointer-events-none" />
                <div className="absolute top-2 right-2 z-10">
                  <span className="inline-block rounded-full bg-white/90 px-2 py-0.5 text-[8px] font-bold tracking-wider text-[#7A2A3D] uppercase shadow-2xs border border-white/60">
                    Explore
                  </span>
                </div>
              </div>

              <div className="p-2.5 text-center flex flex-col justify-between flex-1 bg-white">
                <h3 className="font-bold text-xs text-charcoal leading-snug truncate w-full">
                  {story.name}
                </h3>
                <p className="mt-1 text-[10px] font-semibold text-[#7A2A3D] flex items-center justify-center gap-0.5">
                  <span>Shop Now</span>
                  <span className="text-[9px]">→</span>
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ─── DESKTOP VIEW: Circular Story Carousel with Chevrons (sm: and up) ─── */}
      <div className="hidden sm:block relative group">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrevDesktop}
          aria-label="Previous categories"
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal shadow-xl border border-neutral-200 transition-all duration-300 hover:bg-[#7A2A3D] hover:text-white hover:border-[#7A2A3D] hover:scale-110 cursor-pointer active:scale-95"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel Viewport */}
        <div ref={desktopTrackRef} className="w-full overflow-hidden py-3">
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translate3d(-${desktopIndex * (100 / itemsPerViewDesktop)}%, 0, 0)`,
            }}
          >
            {stories.map((story) => (
              <div
                key={story.slug}
                className="w-1/3 md:w-1/4 lg:w-1/5 shrink-0 px-2 sm:px-3"
              >
                <Link
                  href={story.href}
                  className="group/item flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#7A2A3D] via-[#c07e8c] to-[#b08d4f] shadow-md transition-all duration-300 group-hover/item:shadow-xl group-hover/item:scale-105">
                    <div className="relative sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-44 lg:w-44 overflow-hidden rounded-full border-4 border-white bg-blush shadow-inner">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        sizes="180px"
                        className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                      />
                    </div>
                  </div>

                  <span className="mt-3 text-sm md:text-base font-bold tracking-tight text-charcoal group-hover/item:text-[#7A2A3D] transition-colors max-w-[170px] truncate">
                    {story.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNextDesktop}
          aria-label="Next categories"
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal shadow-xl border border-neutral-200 transition-all duration-300 hover:bg-[#7A2A3D] hover:text-white hover:border-[#7A2A3D] hover:scale-110 cursor-pointer active:scale-95"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
