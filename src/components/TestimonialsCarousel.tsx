"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import ReviewCard from "./ReviewCard";
import { ChevronIcon } from "./Icons";
import type { Review } from "@/lib/reviews";

export interface TestimonialsCarouselProps {
  reviews?: Review[];
  screenshots?: string[];
}

export default function TestimonialsCarousel({
  reviews = [],
  screenshots = [],
}: TestimonialsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const hasScreenshots = Array.isArray(screenshots) && screenshots.length > 0;
  const hasReviews = Array.isArray(reviews) && reviews.length > 0;

  if (!hasScreenshots && !hasReviews) return null;

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.75),
      behavior: "smooth",
    });
  };

  return (
    <section aria-label="Customer reviews" className="bg-[#FAF5F2]/80 border-y border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100% Real Feedback
              </span>
            </div>
            <h2 className="mt-2.5 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-charcoal sm:text-3xl lg:text-4xl">
              Loved by Our Customers
            </h2>
            <p className="mt-1.5 text-xs text-muted sm:text-sm">
              Real WhatsApp chats and verified feedback from women across Pakistan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll reviews left"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-charcoal shadow-sm transition hover:bg-[#7A2A3D] hover:text-white hover:border-[#7A2A3D] hover:scale-105 cursor-pointer"
            >
              <ChevronIcon className="h-4 w-4 rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll reviews right"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-charcoal shadow-sm transition hover:bg-[#7A2A3D] hover:text-white hover:border-[#7A2A3D] hover:scale-105 cursor-pointer"
            >
              <ChevronIcon className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>

        {/* Screenshot Reviews Carousel (When screenshots added in Admin) */}
        {hasScreenshots ? (
          <ul
            ref={trackRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 sm:gap-6 overflow-x-auto scroll-smooth px-4 pb-4 sm:mx-0 sm:px-0"
          >
            {screenshots.map((src, index) => (
              <li
                key={`${src}-${index}`}
                className="w-[72%] shrink-0 snap-start sm:w-[42%] md:w-[32%] lg:w-[24%]"
              >
                <div
                  onClick={() => setActiveModalImage(src)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#7A2A3D]/40"
                >
                  {/* WhatsApp badge */}
                  <div className="mb-2 flex items-center justify-between px-1.5 pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Verified WhatsApp Review
                    </span>
                    <span className="text-[10px] text-muted font-medium">Click to zoom</span>
                  </div>

                  {/* Screenshot Container */}
                  <div className="relative aspect-[9/15] w-full overflow-hidden rounded-xl bg-neutral-100">
                    <Image
                      src={src}
                      alt={`Customer review screenshot ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 75vw, (max-width: 1024px) 35vw, 25vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10 flex items-center justify-center">
                      <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white opacity-0 transition duration-300 group-hover:opacity-100">
                        Tap to View Full
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /* Text Reviews Carousel (Fallback before admin uploads screenshots) */
          <ul
            ref={trackRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0"
          >
            {reviews.map((review) => (
              <li
                key={review.id}
                className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]"
              >
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        )}

        {/* Lightbox Zoom Modal */}
        {activeModalImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveModalImage(null)}
          >
            <div
              className="relative max-h-[90vh] max-w-lg overflow-hidden rounded-2xl bg-white p-3 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModalImage(null)}
                aria-label="Close review"
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative max-h-[82vh] overflow-y-auto rounded-xl">
                <img
                  src={activeModalImage}
                  alt="Customer review full view"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
