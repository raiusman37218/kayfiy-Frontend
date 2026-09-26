"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronIcon, HeartIcon } from "./Icons";
import { useWishlist } from "./useWishlist";

interface ProductGalleryProps {
  images: string[];
  name: string;
  slug: string;
  price: number;
  onSale?: boolean;
  isAvailable?: boolean;
}

export default function ProductGallery({
  images,
  name,
  slug,
  price,
  onSale = false,
  isAvailable = true,
}: ProductGalleryProps) {
  // Ensure at least 1 image and clean duplicates
  const galleryImages =
    images && images.length > 0
      ? Array.from(new Set(images.filter(Boolean)))
      : ["/banners/hero-monsoon.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbTrackRef = useRef<HTMLDivElement>(null);
  const wishlist = useWishlist();
  const isWishlisted = wishlist.has(slug);

  const total = galleryImages.length;

  // Preload all gallery images immediately into memory so picture switching is instantaneous
  useEffect(() => {
    galleryImages.forEach((src) => {
      if (typeof window !== "undefined" && src) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [galleryImages]);

  // Scroll to a specific image in the slide track
  const scrollToImage = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const target = Math.max(0, Math.min(index, total - 1));
      setCurrentIndex(target);
      if (trackRef.current) {
        const width = trackRef.current.clientWidth;
        trackRef.current.scrollTo({
          left: target * width,
          behavior,
        });
      }
    },
    [total]
  );

  // Sync index from native touch scroll or drag
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, clientWidth } = trackRef.current;
    if (clientWidth <= 0) return;
    const newIdx = Math.round(scrollLeft / clientWidth);
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < total) {
      setCurrentIndex(newIdx);
    }
  }, [currentIndex, total]);

  // Keep active thumbnail centered in thumbnail strip
  useEffect(() => {
    const track = thumbTrackRef.current;
    if (!track) return;
    const activeThumb = track.children[currentIndex] as HTMLElement | undefined;
    if (activeThumb) {
      const targetLeft =
        activeThumb.offsetLeft - track.clientWidth / 2 + activeThumb.clientWidth / 2;
      track.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [currentIndex]);

  const handleNext = () => scrollToImage(currentIndex + 1);
  const handlePrev = () => scrollToImage(currentIndex - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && total > 1) handlePrev();
      if (e.key === "ArrowRight" && total > 1) handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, total]);

  return (
    <div className="flex flex-col gap-3 sm:gap-3.5 w-full select-none">
      {/* Main Slide Track Viewport */}
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-blush shadow-xs">
        {/* Hardware-accelerated Swipeable Track with CSS Scroll Snap */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-x"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {galleryImages.map((img, idx) => (
            <div
              key={img + idx}
              className="relative h-full w-full shrink-0 snap-start snap-always"
            >
              <Image
                src={img}
                alt={`${name} - Image ${idx + 1}`}
                fill
                priority={idx === 0}
                loading={idx <= 1 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Sale Badge (Top-Left) */}
        {onSale && (
          <span className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 rounded-full bg-[#7A2A3D] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-white uppercase shadow-xs z-10">
            Sale
          </span>
        )}

        {/* Out of Stock Badge */}
        {!isAvailable && (
          <span className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 rounded-full bg-charcoal/85 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] font-medium tracking-[0.14em] text-white uppercase z-10">
            Out of Stock
          </span>
        )}

        {/* Wishlist Heart Icon (Top-Right) */}
        <button
          type="button"
          onClick={() =>
            wishlist.toggle({ slug, name, image: galleryImages[0], price })
          }
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition hover:scale-110 hover:bg-white cursor-pointer"
        >
          <HeartIcon
            filled={isWishlisted}
            className={`h-4.5 w-4.5 transition ${
              isWishlisted ? "text-[#7A2A3D]" : "text-muted"
            }`}
          />
        </button>

        {/* Desktop Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal opacity-0 shadow-md backdrop-blur-xs transition group-hover:opacity-100 hover:bg-white disabled:opacity-0 cursor-pointer hidden md:flex"
            >
              <ChevronIcon className="h-4 w-4 rotate-90" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === total - 1}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal opacity-0 shadow-md backdrop-blur-xs transition group-hover:opacity-100 hover:bg-white disabled:opacity-0 cursor-pointer hidden md:flex"
            >
              <ChevronIcon className="h-4 w-4 -rotate-90" />
            </button>
          </>
        )}

        {/* Mobile Dot Indicators (Bottom-Center) */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md sm:hidden">
            {galleryImages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollToImage(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dotIdx === currentIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter Badge (Bottom-Right) */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 z-10 rounded-full bg-black/65 px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-white tracking-wider backdrop-blur-xs">
            {currentIndex + 1}/{total}
          </div>
        )}
      </div>

      {/* Interactive Thumbnails Selector Strip */}
      {total > 1 && (
        <div
          ref={thumbTrackRef}
          className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {galleryImages.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => scrollToImage(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`relative aspect-[4/5] w-14 sm:w-20 shrink-0 snap-start overflow-hidden rounded-xl sm:rounded-2xl bg-blush transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "ring-2 ring-[#7A2A3D] ring-offset-2 scale-102 opacity-100 shadow-xs"
                    : "opacity-60 hover:opacity-100 border border-line"
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
