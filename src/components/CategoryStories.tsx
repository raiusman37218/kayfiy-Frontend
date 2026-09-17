import Image from "next/image";
import Link from "next/link";
import { fetchDbCategories } from "@/lib/supabase";
import {
  BRA_IMAGES,
  SET_IMAGES,
  NIGHTWEAR_IMAGES,
  PANTY_IMAGES,
  SHAPEWEAR_IMAGES,
} from "@/lib/images";

const DEFAULT_STORIES = [
  {
    name: "Best Sellers",
    slug: "top-selling",
    href: "/collections/top-selling",
    image: BRA_IMAGES[2] || "/images/bras-assorted.jpg",
    badge: "Hot",
  },
  {
    name: "Padded Bras",
    slug: "bras-padded",
    href: "/collections/bras-padded",
    image: BRA_IMAGES[0] || "/images/bra-lace-black.jpg",
  },
  {
    name: "Bra Sets",
    slug: "bra-sets",
    href: "/collections/bra-sets",
    image: SET_IMAGES[0] || "/images/bras-assorted.jpg",
    badge: "Trending",
  },
  {
    name: "Wireless Comfort",
    slug: "bras-non-padded",
    href: "/collections/bras-non-padded",
    image: BRA_IMAGES[1] || "/images/bra-white-knit.jpg",
  },
  {
    name: "Nightwear",
    slug: "nightwear",
    href: "/collections/nightwear",
    image: NIGHTWEAR_IMAGES[0] || "/images/pyjama-pink.jpg",
  },
  {
    name: "Shapewear",
    slug: "shapewear",
    href: "/collections/shapewear",
    image: SHAPEWEAR_IMAGES[0] || "/images/camisoles-stack.jpg",
  },
  {
    name: "Panties",
    slug: "panties",
    href: "/collections/panties",
    image: PANTY_IMAGES[0] || "/images/brief-cream-lace.jpg",
  },
  {
    name: "Sale Deals",
    slug: "sale",
    href: "/collections/sale",
    image: SET_IMAGES[1] || "/images/bralette-maroon.jpg",
    badge: "Sale",
  },
];

function fallbackImageForSlug(slug: string, index: number): string {
  const s = slug.toLowerCase();
  if (s.includes("set")) return SET_IMAGES[index % SET_IMAGES.length] || SET_IMAGES[0];
  if (s.includes("night") || s.includes("pj") || s.includes("sleep")) return NIGHTWEAR_IMAGES[index % NIGHTWEAR_IMAGES.length] || NIGHTWEAR_IMAGES[0];
  if (s.includes("panty") || s.includes("panties") || s.includes("brief")) return PANTY_IMAGES[index % PANTY_IMAGES.length] || PANTY_IMAGES[0];
  if (s.includes("shape") || s.includes("cinch") || s.includes("suit")) return SHAPEWEAR_IMAGES[index % SHAPEWEAR_IMAGES.length] || SHAPEWEAR_IMAGES[0];
  return BRA_IMAGES[index % BRA_IMAGES.length] || BRA_IMAGES[0];
}

function badgeForSlug(slug: string): string | undefined {
  const s = slug.toLowerCase();
  if (s.includes("top") || s.includes("best") || s.includes("hot")) return "Hot";
  if (s.includes("sale") || s.includes("deal")) return "Sale";
  if (s.includes("new")) return "New";
  return undefined;
}

export default async function CategoryStories() {
  const dbCategories = await fetchDbCategories();

  let stories = DEFAULT_STORIES;

  if (dbCategories && dbCategories.length > 0) {
    // Show top-level categories that have show_on_homepage !== false
    const mainCats = dbCategories
      .filter((cat) => !cat.parent_slug && cat.show_on_homepage !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    if (mainCats.length > 0) {
      stories = mainCats.map((cat, idx) => ({
        name: cat.name,
        slug: cat.slug,
        href: `/collections/${cat.slug}`,
        image: cat.image && (cat.image.startsWith("http") || cat.image.startsWith("/"))
          ? cat.image
          : fallbackImageForSlug(cat.slug, idx),
        badge: badgeForSlug(cat.slug),
      }));
    }
  }

  return (
    <section
      aria-label="Shop categories"
      className="mx-auto max-w-7xl px-4 pt-4 pb-2 sm:px-6"
    >
      <div className="no-scrollbar -mx-4 flex items-center gap-4 sm:gap-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 scroll-smooth">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={story.href}
            className="group flex flex-col items-center shrink-0 text-center transition-transform duration-300 hover:scale-105"
          >
            {/* Story Circle with Brand Gradient Ring */}
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#7A2A3D] via-[#c07e8c] to-[#b08d4f] shadow-xs transition-all duration-300 group-hover:shadow-md group-hover:from-[#b08d4f] group-hover:to-[#7A2A3D]">
              <div className="relative h-17 w-17 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-cream bg-blush">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Optional tiny badge pill */}
              {story.badge && (
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.2 text-[9px] font-bold tracking-wider uppercase text-white shadow-xs ${
                    story.badge === "Hot"
                      ? "bg-[#7A2A3D]"
                      : story.badge === "Sale"
                      ? "bg-[#b08d4f]"
                      : "bg-charcoal"
                  }`}
                >
                  {story.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span className="mt-2 text-[11px] sm:text-xs font-semibold tracking-tight text-charcoal group-hover:text-[#7A2A3D] transition-colors max-w-[76px] sm:max-w-[84px] truncate">
              {story.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
