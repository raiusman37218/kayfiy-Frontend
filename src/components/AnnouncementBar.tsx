"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { announcements as defaultAnnouncements } from "@/lib/data";
import { fetchDbStoreSettings } from "@/lib/supabase";

export default function AnnouncementBar() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<string[]>(defaultAnnouncements);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchDbStoreSettings();
        if (Array.isArray(settings?.announcements) && settings.announcements.length > 0) {
          const active = (settings.announcements as any[])
            .filter((a: any) => a && a.enabled)
            .map((a: any) => a.text);
          if (active.length > 0) {
            setMessages(active);
          }
        } else if (settings?.announcement_text && settings.announcement_enabled) {
          setMessages([settings.announcement_text]);
        }
      } catch (err) {
        console.warn("Could not load dynamic announcements:", err);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const timer = window.setInterval(() => {
      setIsTransitioning(true);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % messages.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [messages]);

  if (pathname === "/checkout") return null;

  return (
    <div className="bg-[#7A2A3D] text-white font-medium relative overflow-hidden">
      {/* Subtle shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />

      {/* Zari-style gold hairline — absolute, so it adds no height */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 relative">
        <p
          key={index}
          className={`text-center text-[11px] tracking-[0.18em] uppercase sm:text-xs font-semibold transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 -translate-y-1"
              : "opacity-100 translate-y-0"
          }`}
          aria-live="polite"
        >
          {messages[index % messages.length]}
        </p>
      </div>
    </div>
  );
}
