"use client";

const MARQUEE_ITEMS = [
  { icon: "✨", text: "100% DISCREET PACKAGING — ZERO PRODUCT LABELS OUTSIDE" },
  { icon: "🚚", text: "FREE DELIVERY NATIONWIDE ON ORDERS OVER RS. 2,999" },
  { icon: "🔄", text: "30-DAY HASSLE-FREE SIZE EXCHANGE" },
  { icon: "💵", text: "CASH ON DELIVERY (COD) AVAILABLE ACROSS PAKISTAN" },
  { icon: "⭐", text: "4.9/5 RATED BY OVER 15,000+ VERIFIED CUSTOMERS" },
  { icon: "💬", text: "NEED SIZE HELP? EXPERT ASSISTANCE ON WHATSAPP" },
];

export default function MarqueeBanner() {
  return (
    <div
      aria-label="Store highlights"
      className="group relative w-full overflow-hidden bg-charcoal text-cream py-2.5 border-y border-white/10 select-none"
    >
      {/* Subtle gold accent border line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
        {/* Render twice for seamless continuous loop */}
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
