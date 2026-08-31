"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronIcon } from "./Icons";

interface ProductGalleryProps {
  images: string[];
  name: string;
  onSale?: boolean;
  isAvailable?: boolean;
}

export default function ProductGallery({
  images,
  name,
  onSale = false,
  isAvailable = true,
}: ProductGalleryProps) {
  // Ensure we have at least 1 image and deduplicate
  const galleryImages = images && images.length > 0
    ? Array.from(new Set(images.filter(Boolean)))
    : ["/banners/hero-monsoon.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const total = galleryImages.length;

  const goTo = (index: number) => {
    setCurrentIndex((index + total) % total);
  };

  const handleNext = () => goTo(currentIndex + 1);
  const handlePrev = () => goTo(currentIndex - 1);

  // Minimum swipe distance in px
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && total > 1) {
      handleNext();
    } else if (isRightSwipe && total > 1) {
      handlePrev();
    }
  };

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
    <div className="flex flex-col gap-3.5">
      {/* Main Large Image Slide Viewport */}
      <div
        className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-blush shadow-sm select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={galleryImages[currentIndex]}
          alt={`${name} - Image ${currentIndex + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-102"
        />

        {/* Sale Badge (Top-Left) */}
        {onSale && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-[#7A2A3D] px-3 py-1 text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-white uppercase shadow-xs">
            Sale
          </span>
        )}

        {/* Out of Stock Badge */}
        {!isAvailable && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-charcoal/85 px-3 py-1 text-[10px] font-medium tracking-[0.14em] text-white uppercase">
            Out of Stock
          </span>
        )}

        {/* Wishlist Heart Icon (Top-Right, matching reference) */}
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition hover:scale-110 hover:bg-white cursor-pointer"
        >
          <svg
            className={`h-4.5 w-4.5 transition ${
              isWishlisted ? "fill-[#7A2A3D] text-[#7A2A3D]" : "fill-none text-muted"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Navigation Arrows (Desktop & Tablet Hover) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-charcoal opacity-0 shadow-md backdrop-blur-xs transition group-hover:opacity-100 hover:bg-white cursor-pointer md:flex hidden"
            >
              <ChevronIcon className="h-4 w-4 rotate-90" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-charcoal opacity-0 shadow-md backdrop-blur-xs transition group-hover:opacity-100 hover:bg-white cursor-pointer md:flex hidden"
            >
              <ChevronIcon className="h-4 w-4 -rotate-90" />
            </button>
          </>
        )}

        {/* Counter Badge in Bottom Right (e.g. 1/10 or 1/3) */}
        {total > 1 && (
          <div className="absolute bottom-3.5 right-3.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white tracking-wider backdrop-blur-xs">
            {currentIndex + 1}/{total}
          </div>
        )}
      </div>

      {/* Interactive Thumbnails Selector Strip (Only if multiple pictures exist) */}
      {total > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {galleryImages.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`relative aspect-[4/5] w-16 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-blush transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "ring-2 ring-[#7A2A3D] ring-offset-2 scale-102 opacity-100 shadow-sm"
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
