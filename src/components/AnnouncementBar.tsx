"use client";

import { useEffect, useState } from "react";
import { announcements as defaultAnnouncements } from "@/lib/data";
import { fetchDbStoreSettings } from "@/lib/supabase";

export default function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>(defaultAnnouncements);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchDbStoreSettings();
        if (settings?.announcements && settings.announcements.length > 0) {
          const active = settings.announcements
            .filter((a) => a.enabled)
            .map((a) => a.text);
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

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % messages.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [messages]);

  return (
    <div className="bg-[#C4526E] text-white font-medium">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4">
        <p
          key={index}
          className="animate-fade-up text-center text-[11px] tracking-[0.18em] uppercase sm:text-xs font-semibold"
          aria-live="polite"
        >
          {messages[index % messages.length]}
        </p>
      </div>
    </div>
  );
}
