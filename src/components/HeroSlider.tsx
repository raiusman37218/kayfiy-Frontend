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
    image: "/banners/hero/banner-1-desktop.png",
    mobileImage: "/banners/hero/banner-1-mobile.png",
    href: "/collections/sale",
    alt: "End of Season Sale - Upto 40% Off",
  },
  {
    id: "hero-2",
    image: "/banners/hero/banner-2-desktop.png",
    mobileImage: "/banners/hero/banner-2-mobile.png",
    href: "/collections/bras",
    alt: "Support Without The Poke - Perfect Coverage Bra",
  },
  {
    id: "hero-3",
    image: "/banners/hero/banner-3-desktop.webp",
    mobileImage: "/banners/hero/banner-3-mobile.webp",
    href: "/collections/all",
    alt: "In My Pink Era - Strapless Butt Lifting Bodysuit",
  },
  {
    id: "hero-4",
    image: "/banners/hero/banner-4-desktop.webp",
    mobileImage: "/banners/hero/banner-4-mobile.webp",
    href: "/collections/bras",
    alt: "Summer Layer That Actually Breathes - Minimizer Bra",
  },
  {
    id: "hero-5",
    image: "/banners/hero/banner-5-desktop.webp",
    mobileImage: "/banners/hero/banner-5-mobile.webp",
    href: "/collections/all",
    alt: "Introducing JellySoft Collection - The Softest Support",
  },
];

const AUTOPLAY_MS = 3500;

interface HeroSliderProps {
  slides?: CleanHeroSlide[];
}

export default function HeroSlider({ slides: propSlides }: HeroSliderProps) {
  const slides = (propSlides && propSlides.length > 0) ? propSlides : DEFAULT_SLIDES;
  const isMultiSlide = slides.length > 1;

  const [index, setIndex] = useState(0);
  const viewportRef = useRef<HTMLElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const paused = useRef(false);
  const lastTickRef = useRef<number>(Date.now());

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length);
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

  // Autoplay (Inunder style 3.5s interval)
  useEffect(() => {
    if (!isMultiSlide) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      if (!paused.current) {
        setIndex((current) => (current + 1) % slides.length);
      }
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [isMultiSlide, slides.length]);

  // Touch gesture swipe support for mobile
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
    if (diff > 40) {
      goTo(index + 1);
    } else if (diff < -40) {
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
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]"
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
            <div className="relative w-full h-[390px] xs:h-[420px] sm:h-[460px] md:h-[500px] lg:h-[540px] xl:h-[580px] overflow-hidden">
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

      {/* Left/Right Floating Circle Arrow Controls (Inunder style: 50px desktop, 40px mobile, white/80 bg, hover black) */}
      {isMultiSlide && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous banner"
            className="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white hover:opacity-100 opacity-80 cursor-pointer"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
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
            className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/80 text-black shadow-md transition-all duration-300 hover:bg-black hover:text-white hover:opacity-100 opacity-80 cursor-pointer"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
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

      {/* Bottom Floating Minimalist Dots (Inunder style: clean white circular dots, active scale 1.25) */}
      {isMultiSlide && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:gap-2.5 items-center pointer-events-auto">
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.id || dotIndex}
              type="button"
              onClick={() => goTo(dotIndex)}
              aria-label={`Go to banner ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                dotIndex === index
                  ? "w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white opacity-100 scale-125 shadow-sm"
                  : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/55 hover:bg-white hover:opacity-100"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
