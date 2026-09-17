import Image from "next/image";
import { InstagramIcon } from "./Icons";

const INSTAGRAM_URL = "https://www.instagram.com/kayfiy.pk";

// Curated tiles. Swap these for live Instagram Graph API posts once an app
// token is available -- the layout takes any six square images.
const TILES = [
  "/images/bras-assorted.jpg",
  "/images/camisole-blush-satin.jpg",
  "/images/bra-lace-black.jpg",
  "/images/pyjama-pink.jpg",
  "/images/brief-cream-lace.jpg",
  "/images/silk-fabrics.jpg",
];

export default function InstagramFeed() {
  return (
    <section aria-label="Instagram" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
      <div className="mb-6 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-charcoal sm:text-3xl">
          @kayfiy.pk
        </h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#7A2A3D] uppercase transition hover:underline"
        >
          <InstagramIcon className="h-4 w-4" />
          Follow us on Instagram
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
        {TILES.map((src, index) => (
          <a
            key={src}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-2xl bg-blush"
          >
            <Image
              src={src}
              alt={`KAYFIY on Instagram ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 16vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-charcoal/0 text-cream opacity-0 transition duration-300 group-hover:bg-charcoal/35 group-hover:opacity-100">
              <InstagramIcon className="h-6 w-6" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
