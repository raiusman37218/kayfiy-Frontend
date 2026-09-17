"use client";

const MARQUEE_ITEMS = [
  { icon: "🔥", text: "LIMITED TIME: FLAT 30% OFF SELECTED STYLES" },
  { icon: "✨", text: "ULTRA-SOFT BREATHABLE COTTON-MODAL & LACE" },
  { icon: "📦", text: "DISCREET & CONFIDENTIAL TAMPER-PROOF DISPATCH" },
  { icon: "🚚", text: "SAME-DAY DISPATCH • FREE SHIPPING OVER RS. 2,999" },
  { icon: "⭐", text: "RATED 4.9/5 BY OVER 15,000+ PAKISTANI WOMEN" },
  { icon: "💬", text: "CONFIDENTIAL SIZING CONSULTATION ON WHATSAPP" },
];

export default function MarqueeBanner() {
  return (
    <div
      aria-label="Store highlights"
      className="group relative w-full overflow-hidden bg-charcoal text-cream py-2.5 border-y border-white/10 select-none"
    >
      {/* Subtle gold accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-6 text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase whitespace-nowrap text-cream/90"
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
            <span className="inline-block h-1 w-1 rounded-full bg-gold/70 ml-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
