"use client";

import { useRef } from "react";
import ReviewCard from "./ReviewCard";
import { ChevronIcon } from "./Icons";
import type { Review } from "@/lib/reviews";

export default function TestimonialsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.round(track.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  if (reviews.length === 0) return null;

  return (
    <section aria-label="Customer reviews" className="bg-blush/45">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-charcoal sm:text-3xl">
              Loved by our customers
            </h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              Real reviews from women across Pakistan.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll reviews left"
              className="rounded-full border border-line p-2 text-charcoal transition hover:border-[#7A2A3D] hover:text-[#7A2A3D] cursor-pointer"
            >
              <ChevronIcon className="h-4 w-4 rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll reviews right"
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
          {reviews.map((review) => (
            <li
              key={review.id}
              className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]"
            >
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
