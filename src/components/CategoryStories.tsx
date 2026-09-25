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
  if (s.includes("pad"))
    return PANTY_IMAGES[1] || "/images/brief-black-cotton.jpg";
  return BRA_IMAGES[index % BRA_IMAGES.length] || BRA_IMAGES[0];
}

function badgeForSlug(slug: string): string | undefined {
  return undefined;
}

export interface CategoryStoriesProps {
  categories?: DbCategory[];
}

export default function CategoryStories({ categories }: CategoryStoriesProps) {
  // Build stories array from dbCategories or fallback
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
          badge: badgeForSlug(cat.slug),
        }));
      }
    }
    return DEFAULT_STORIES;
  })();

  const count = stories.length;
  // Duplicate 3 times for seamless infinite circular movement
  const extendedStories = [...stories, ...stories, ...stories];

  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [itemWidth, setItemWidth] = useState(0);
  const [index, setIndex] = useState(count);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const paused = useRef(false);

  // Responsive items-per-view calculation: Exactly 5 items in view on desktop (lg: >=1024px)
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    let ipv = 5;
    if (width < 450) {
      ipv = 2.2; // Mobile: 2 rectangular product-style cards + peek of 3rd
    } else if (width < 640) {
      ipv = 2.6;
    } else if (width < 768) {
      ipv = 3;
    } else if (width < 1024) {
      ipv = 4;
    } else {
      ipv = 5; // Exactly 5 on desktop view
    }
    setItemsPerView(ipv);
    setItemWidth(width / ipv);
  }, []);

  useEffect(() => {
    updateDimensions();
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateDimensions]);

  // Next slide
  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setIndex((prev) => prev + 1);
  }, []);

  // Previous slide
  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setIndex((prev) => prev - 1);
  }, []);

  // Seamless infinite loop normalization
  const handleTransitionEnd = () => {
    if (index >= count * 2) {
      setIsTransitioning(false);
      setIndex(index - count);
    } else if (index < count) {
      setIsTransitioning(false);
      setIndex(index + count);
    }
  };

  // Re-enable smooth transition right after silent index reset
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Autoplay movement: smooth continuous cycle every 3.2 seconds
  useEffect(() => {
    if (count <= itemsPerView) return;

    const timer = setInterval(() => {
      if (!paused.current) {
        handleNext();
      }
    }, 3200);

    return () => clearInterval(timer);
  }, [count, itemsPerView, handleNext]);

  // Touch gesture swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    paused.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    paused.current = false;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      aria-label="Shop by category"
      className="relative mx-auto max-w-7xl px-3 pt-6 pb-4 sm:px-6 sm:pt-8 select-none"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Centered Section Header */}
      <div className="mb-5 sm:mb-8 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-charcoal">
          Shop by Category
        </h2>
        <div className="mx-auto mt-2.5 h-0.5 w-12 bg-gradient-to-r from-transparent via-[#7A2A3D] to-transparent" />
      </div>

      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous categories"
          className="absolute -left-1 sm:-left-4 top-[42%] -translate-y-1/2 z-30 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-charcoal shadow-xl border border-neutral-200 transition-all duration-300 hover:bg-[#7A2A3D] hover:text-white hover:border-[#7A2A3D] hover:scale-110 cursor-pointer opacity-90 group-hover:opacity-100"
        >
          <svg
            className="h-4 w-4 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel Track Viewport */}
        <div ref={containerRef} className="w-full overflow-hidden py-2 sm:py-3">
          <div
            className="flex"
            style={{
              transform: `translate3d(-${index * itemWidth}px, 0, 0)`,
              transition: isTransitioning
                ? "transform 600ms cubic-bezier(0.25, 1, 0.5, 1)"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedStories.map((story, i) => (
              <div
                key={`${story.slug}-${i}`}
                className="shrink-0 flex justify-center px-1.5 sm:px-2.5"
                style={{ width: `${itemWidth}px` }}
              >
                <Link
                  href={story.href}
                  className="group/item flex flex-col w-full h-full items-center"
                >
                  {/* ─── MOBILE VIEW: Gorgeous Rectangular Product-Card-Style (< sm) ─── */}
                  <div className="sm:hidden flex flex-col w-full h-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-[#ECE5E5] transition-all duration-300 hover:shadow-md active:scale-[0.98]">
                    {/* Rectangular Image Container */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F9F5F3]">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        sizes="(max-width: 640px) 200px, 250px"
                        className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                      />

                      {/* Subtle Bottom Shadow Vignette */}
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 via-black/5 to-transparent pointer-events-none" />

                      {/* Shezaib-style Corner Badge */}
                      {story.badge ? (
                        <div className="absolute top-2 right-2 z-10">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white shadow-xs uppercase ${
                              story.badge === "Hot"
                                ? "bg-[#7A2A3D]"
                                : story.badge === "Sale"
                                ? "bg-[#E50000]"
                                : "bg-charcoal"
                            }`}
                          >
                            {story.badge}
                          </span>
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="inline-block rounded-full bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[8px] font-bold tracking-wider text-[#7A2A3D] uppercase shadow-2xs border border-white/60">
                            Explore
                          </span>
                        </div>
                      )}

                      {/* Bottom-right sparkle icon (Shezaib aesthetic touch) */}
                      <div className="pointer-events-none absolute bottom-1.5 right-1.5 z-10 text-white/80 drop-shadow-sm opacity-70">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l2.2 7.8 7.8 2.2-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Shezaib-style Clean Text Body */}
                    <div className="p-2.5 text-center flex flex-col justify-between flex-1 bg-white">
                      <h3 className="font-bold text-xs xs:text-sm text-charcoal leading-snug truncate w-full group-hover/item:text-[#7A2A3D] transition-colors">
                        {story.name}
                      </h3>
                      <p className="mt-1 text-[10px] font-semibold text-[#7A2A3D] flex items-center justify-center gap-1">
                        <span>Shop Now</span>
                        <span className="text-[9px] transition-transform duration-200 group-hover/item:translate-x-0.5">→</span>
                      </p>
                    </div>
                  </div>

                  {/* ─── DESKTOP VIEW: Round Circular Story (sm: and up) ─── */}
                  <div className="hidden sm:flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
                    {/* Large Story Circle with Luxury Gradient Ring */}
                    <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#7A2A3D] via-[#c07e8c] to-[#b08d4f] shadow-md transition-all duration-300 group-hover/item:shadow-xl group-hover/item:scale-105 group-hover/item:from-[#b08d4f] group-hover/item:to-[#7A2A3D]">
                      <div className="relative sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-44 lg:w-44 xl:h-48 xl:w-48 overflow-hidden rounded-full border-4 border-white bg-blush shadow-inner">
                        <Image
                          src={story.image}
                          alt={story.name}
                          fill
                          sizes="(max-width: 1024px) 170px, 200px"
                          className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                        />
                      </div>

                      {/* Optional badge pill */}
                      {story.badge && (
                        <span
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase text-white shadow-md ${
                            story.badge === "Hot"
                              ? "bg-[#7A2A3D]"
                              : story.badge === "Sale"
                              ? "bg-[#b08d4f]"
                              : "bg-charcoal"
                          }`}
                        >
                          {story.badge}
                        </span>
                      )}
                    </div>

                    {/* Category Name Label */}
                    <span className="mt-3 text-sm md:text-base font-bold tracking-tight text-charcoal group-hover/item:text-[#7A2A3D] transition-colors max-w-[170px] truncate">
                      {story.name}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next categories"
          className="absolute -right-1 sm:-right-4 top-[42%] -translate-y-1/2 z-30 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-charcoal shadow-xl border border-neutral-200 transition-all duration-300 hover:bg-[#7A2A3D] hover:text-white hover:border-[#7A2A3D] hover:scale-110 cursor-pointer opacity-90 group-hover:opacity-100"
        >
          <svg
            className="h-4 w-4 sm:h-6 sm:w-6"
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
