"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/lib/data";

const AUTOPLAY_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const paused = useRef(false);
  const progressRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const goTo = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
    setProgress(0);
    lastTickRef.current = Date.now();
  }, []);

  // Autoplay + progress bar
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animFrameId: number;

    function tick() {
      if (!paused.current) {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;
        const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
        setProgress(pct);

        if (elapsed >= AUTOPLAY_MS) {
          setIndex((current) => (current + 1) % heroSlides.length);
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
  }, [progress]);

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
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {heroSlides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            className="relative h-[420px] w-full shrink-0 sm:h-[460px] lg:h-[520px]"
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
              <p className="text-[11px] tracking-[0.24em] uppercase animate-fade-in">
                {slide.eyebrow}
              </p>
              <h2 className="mt-3 max-w-xl font-[family-name:var(--font-heading)] text-4xl leading-tight sm:text-5xl lg:text-6xl font-bold tracking-tight">
                {slide.title}
              </h2>
              <p className="mt-3 max-w-md text-sm sm:text-base opacity-90">
                {slide.caption}
              </p>
              <Link
                href={slide.href}
                tabIndex={slideIndex === index ? undefined : -1}
                className="mt-7 inline-block rounded-full bg-cream px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-charcoal uppercase transition-all duration-300 hover:bg-[#C4526E] hover:text-white hover:shadow-lg hover:scale-105"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Left/Right Arrow Controls (Desktop) */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white/40 hover:scale-110 cursor-pointer hidden sm:flex"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white/40 hover:scale-110 cursor-pointer hidden sm:flex"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom Slider Dots + Progress Bar */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2.5 items-center">
        {heroSlides.map((slide, dotIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}`}
            aria-current={dotIndex === index}
            className={`relative h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${
              dotIndex === index ? "w-9 bg-cream/40" : "w-2 bg-cream/50 hover:bg-cream/70"
            }`}
          >
            {dotIndex === index && (
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-cream transition-none"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
