import Image from "next/image";
import { InstagramIcon } from "./Icons";

const INSTAGRAM_URL = "https://www.instagram.com/_kayfiy/";

const REELS = [
  {
    image: "/images/bra-lace-black.jpg",
    title: "Wire-free lift & zero digging straps",
    views: "18.4K",
  },
  {
    image: "/images/camisole-blush-satin.jpg",
    title: "Pure mulberry silk touch feel check",
    views: "24.1K",
  },
  {
    image: "/images/bras-assorted.jpg",
    title: "Finding your sister bra size in 30s",
    views: "31.9K",
  },
  {
    image: "/images/pyjama-pink.jpg",
    title: "Breathable all-day cotton lounge set",
    views: "14.7K",
  },
  {
    image: "/images/brief-cream-lace.jpg",
    title: "Seamless everyday comfort test",
    views: "21.3K",
  },
];

export default function InstagramFeed() {
  return (
    <section aria-label="Instagram Reels" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 px-4 py-1.5 border border-pink-200">
          <InstagramIcon className="h-4 w-4 text-[#7A2A3D]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A2A3D]">Instagram Reels</span>
        </div>

        <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-charcoal sm:text-3xl lg:text-4xl">
          Watch Our Stories & Reels
        </h2>
        <p className="mt-2 text-xs text-muted sm:text-sm max-w-md">
          Real fabric reviews, sizing tips, and comfort unboxings. Follow us <span className="font-semibold text-charcoal">@_kayfiy</span>.
        </p>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white transition-all duration-300 hover:bg-[#7A2A3D] hover:shadow-md"
        >
          <InstagramIcon className="h-3.5 w-3.5" />
          <span>Follow @_kayfiy</span>
        </a>
      </div>

      {/* Vertical 9:16 Reels Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 sm:gap-4">
        {REELS.map((reel, index) => (
          <a
            key={index}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-neutral-100 shadow-xs transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <Image
              src={reel.image}
              alt={reel.title}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-108"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 opacity-90 transition-opacity duration-300 group-hover:opacity-95" />

            {/* Top Reel Badge */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white/90">
              <span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                Reel
              </span>
              <span className="text-[10px] font-semibold text-white/80">{reel.views} views</span>
            </div>

            {/* Play Button Icon in Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 backdrop-blur-md text-white transition-all duration-300 group-hover:scale-115 group-hover:bg-[#7A2A3D]">
                <svg className="h-6 w-6 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Bottom Title & Instagram Handle */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="line-clamp-2 text-xs font-semibold leading-snug drop-shadow-sm">
                {reel.title}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium text-white/80">
                <InstagramIcon className="h-3 w-3" />
                <span>@_kayfiy</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
