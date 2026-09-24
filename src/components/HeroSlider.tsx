"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CleanHeroSlide {
  id: string;
  image: string;
  mobileImage?: string;
  href?: string;
  alt?: string;
}

const DEFAULT_SLIDES: CleanHeroSlide[] = [
  {
    id: "hero-1",
    image: "/banners/hero-monsoon.jpg",
    mobileImage: "/banners/hero-monsoon.jpg",
    href: "/collections/all",
    alt: "KAYFIY Comfort Wear",
  },
  {
    id: "hero-2",
    image: "/banners/hero-sale.jpg",
    mobileImage: "/banners/hero-sale.jpg",
    href: "/collections/sale",
    alt: "Comfort Season Sale",
  },
  {
    id: "hero-3",
    image: "/banners/hero-fit.jpg",
    mobileImage: "/banners/hero-fit.jpg",
    href: "/collections/bras",
    alt: "Support You Forget You Are Wearing",
  },
  {
    id: "hero-4",
    image: "/banners/hero-budget.jpg",
    mobileImage: "/banners/hero-budget.jpg",
    href: "/collections/budget-deals",
    alt: "Essentials Under Rs. 1,500",
  },
];

const AUTOPLAY_MS = 5000;

interface HeroSliderProps {
  slides?: CleanHeroSlide[];
}

export default function HeroSlider({ slides: propSlides }: HeroSliderProps) {
  const slides = (propSlides && propSlides.length > 0) ? propSlides : DEFAULT_SLIDES;
  const isMultiSlide = slides.length > 1;

  const [index, setIndex] = useState(0);
  const viewportRef = useRef<HTMLElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [progress, setProgress] = useState(0);
  const paused = useRef(false);
  const lastTickRef = useRef<number>(Date.now());

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length);
      setProgress(0);
      lastTickRef.current = Date.now();
    },
    [slides.length]
  );

  // Measure viewport accurately to avoid subpixel gaps
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setSlideWidth(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay + progress bar (only when multi-slide)
  useEffect(() => {
    if (!isMultiSlide) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animFrameId: number;

    function tick() {
      if (!paused.current) {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;
        const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
        setProgress(pct);

        if (elapsed >= AUTOPLAY_MS) {
          setIndex((current) => (current + 1) % slides.length);
          setProgress(0);
          lastTickRef.current = now;
        }
      } else {
        lastTickRef.current = Date.now() - (progress / 100) * AUTOPLAY_MS;
      }
      animFrameId = requestAnimationFrame(tick);
    }

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [progress, isMultiSlide, slides.length]);

  // Touch gesture swipe support
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
    if (!isMultiSlide || touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      goTo(index + 1);
    } else if (diff < -45) {
      goTo(index - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      ref={viewportRef}
      aria-label="Promotion Banners"
      aria-roledescription="carousel"
      className="group relative w-full overflow-hidden select-none bg-neutral-100"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isMultiSlide ? `translate3d(-${index * slideWidth}px, 0, 0)` : "none",
        }}
      >
        {slides.map((slide, slideIndex) => {
          const hasLink = Boolean(slide.href && slide.href.trim() && slide.href !== "#");
          const hasSeparateMobile = Boolean(
            slide.mobileImage &&
            slide.mobileImage.trim() &&
            slide.mobileImage !== slide.image
          );

          const bannerContent = (
            <div className="relative w-full aspect-[4/3] xs:aspect-[16/10] sm:aspect-[2/1] lg:aspect-[2.25/1] max-h-[640px] overflow-hidden">
              {hasSeparateMobile ? (
                <>
                  {/* Mobile Banner (<640px) */}
                  <div className="relative w-full h-full block sm:hidden">
                    <Image
                      src={slide.mobileImage!}
                      alt={slide.alt || `Promotion banner ${slideIndex + 1}`}
                      fill
                      priority={slideIndex === 0}
                      sizes="100vw"
                      className="object-cover object-center"
                    />
                  </div>
                  {/* Desktop Banner (>=640px) */}
                  <div className="relative w-full h-full hidden sm:block">
                    <Image
                      src={slide.image}
                      alt={slide.alt || `Promotion banner ${slideIndex + 1}`}
                      fill
                      priority={slideIndex === 0}
                      sizes="100vw"
                      className="object-cover object-center"
                    />
                  </div>
                </>
              ) : (
                /* Universal Banner */
                <Image
                  src={slide.image}
                  alt={slide.alt || `Promotion banner ${slideIndex + 1}`}
                  fill
                  priority={slideIndex === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              )}
            </div>
          );

          return (
            <div
              key={slide.id || slideIndex}
              className="relative w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${slides.length}`}
              aria-hidden={isMultiSlide ? slideIndex !== index : false}
            >
              {hasLink ? (
                <Link
                  href={slide.href!}
                  tabIndex={slideIndex === index ? undefined : -1}
                  className="block w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7A2A3D]"
                  aria-label={slide.alt || `View promotion ${slideIndex + 1}`}
                >
                  {bannerContent}
                </Link>
              ) : (
                bannerContent
              )}
            </div>
          );
        })}
      </div>

      {/* Left/Right Arrow Controls (Desktop, shown on hover when > 1 slide) */}
      {isMultiSlide && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous banner"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-lg backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-105 cursor-pointer hidden sm:flex"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next banner"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-lg backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:scale-105 cursor-pointer hidden sm:flex"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Bottom Slider Dots + Progress Indicator (Only when > 1 slide) */}
      {isMultiSlide && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 items-center bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.id || dotIndex}
              type="button"
              onClick={() => goTo(dotIndex)}
              aria-label={`Go to banner ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={`relative h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${
                dotIndex === index ? "w-7 bg-white/40" : "w-2 bg-white/60 hover:bg-white"
              }`}
            >
              {dotIndex === index && (
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-white transition-none"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
