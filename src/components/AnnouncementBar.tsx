"use client";

import { useEffect, useState } from "react";
import { announcements } from "@/lib/data";

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % announcements.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-charcoal text-cream">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4">
        <p
          key={index}
          className="animate-fade-up text-center text-[11px] tracking-[0.18em] uppercase sm:text-xs"
          aria-live="polite"
        >
          {announcements[index]}
        </p>
      </div>
    </div>
  );
}
