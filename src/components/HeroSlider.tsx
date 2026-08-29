"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/lib/data";

const AUTOPLAY_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const goTo = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (!paused.current) {
        setIndex((current) => (current + 1) % heroSlides.length);
      }
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="Featured promotions"
      aria-roledescription="carousel"
      className="group relative w-full overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {heroSlides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            className="relative h-[400px] w-full shrink-0 lg:h-[500px]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${heroSlides.length}`}
            aria-hidden={slideIndex !== index}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/35 to-transparent" />

            <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6 text-cream sm:px-10">
              <p className="text-[11px] tracking-[0.24em] uppercase">
                {slide.eyebrow}
              </p>
              <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                {slide.title}
              </h2>
              <p className="mt-3 max-w-md text-sm sm:text-base">
                {slide.caption}
              </p>
              <Link
                href={slide.href}
                tabIndex={slideIndex === index ? undefined : -1}
                className="mt-7 inline-block rounded-full bg-cream px-8 py-3.5 text-xs tracking-[0.16em] text-charcoal uppercase transition hover:bg-rose hover:text-white"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Slider Dots */}
      <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2">
        {heroSlides.map((slide, dotIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}`}
            aria-current={dotIndex === index}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              dotIndex === index ? "w-7 bg-cream" : "w-2 bg-cream/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
