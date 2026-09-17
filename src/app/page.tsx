import HeroSlider from "@/components/HeroSlider";
import MarqueeBanner from "@/components/MarqueeBanner";
import CategoryStories from "@/components/CategoryStories";
import ProductCarousel from "@/components/ProductCarousel";
import PromoBanner from "@/components/PromoBanner";
import SizeGuideBanner from "@/components/SizeGuideBanner";
import USPStrip from "@/components/USPStrip";
import LookbookBanner from "@/components/LookbookBanner";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import InstagramFeed from "@/components/InstagramFeed";
import NewsletterSection from "@/components/NewsletterSection";
import { getLiveProducts } from "@/lib/catalog";
import { getFeaturedReviews } from "@/lib/reviews";
import { SECTION_BANNERS } from "@/lib/images";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const products = await getLiveProducts();
  const featuredReviews = await getFeaturedReviews(6);

  const bestSellers = products.filter((p) => p.bestsellere || p.price > 1600);
  const bras = products.filter(
    (p) => p.category?.toLowerCase() === "bras" || /bra/i.test(p.name),
  );
  const braSets = products.filter(
    (p) =>
      p.category?.toLowerCase() === "bra sets" ||
      (/set/i.test(p.name) && /bra/i.test(p.name)),
  );
  const shapewear = products.filter(
    (p) =>
      p.category?.toLowerCase() === "shapewear" ||
      /shaper|shapewear|suit|cincher|belt/i.test(p.name),
  );
  const panties = products.filter(
    (p) =>
      p.category?.toLowerCase() === "panties" ||
      /panty|panties|brief/i.test(p.name),
  );
  const nightwear = products.filter(
    (p) =>
      p.category?.toLowerCase() === "nightwear" ||
      /night|robe|pyjama|silk|satin/i.test(p.name),
  );

  return (
    <main className="space-y-1 sm:space-y-2">
      {/* 1. Hero Showcase Slider */}
      <HeroSlider />

      {/* 2. Store Perks & Live Announcement Marquee */}
      <MarqueeBanner />

      {/* 3. Circular Story Categories (Quick 1-tap mobile & desktop browsing) */}
      <CategoryStories />

      {/* 4. Best Sellers — Pure Product Carousel */}
      <ProductCarousel
        title="Best Sellers"
        blurb="The pieces our customers love, wear and reorder most."
        products={bestSellers.length > 0 ? bestSellers : products.slice(0, 8)}
        viewAllHref="/collections/top-selling"
      />

      {/* 5. Bras — Category Carousel with Filter Tabs */}
      <ProductCarousel
        title="Bras"
        blurb="Padded, non-padded, wired and sports — crafted for sizes 30A to 44DD."
        products={bras.length > 0 ? bras : products.slice(0, 8)}
        tabs={["All", "Padded", "Push-Up", "Non-Padded", "Sports"]}
        viewAllHref="/collections/bras"
        tone="soft"
      />

      {/* 6. Editorial Promotional Banner Break: Luxury Matched Sets */}
      <PromoBanner
        banner={SECTION_BANNERS.braSets}
        badge="Luxury Collection"
        title="Lace & Satin Bra Sets"
        subtitle="Coordinated bra and brief sets tailored for flawless contouring, all-day breathability, and pure confidence."
        ctaText="Shop Bra Sets"
        href="/collections/bra-sets"
      />

      {/* 7. Bra Sets — Category Carousel */}
      <ProductCarousel
        title="Bra Sets"
        blurb="Coordinated bra and brief sets, from everyday essentials to bridal trousseau."
        products={braSets.length > 0 ? braSets : products.slice(0, 8)}
        viewAllHref="/collections/bra-sets"
      />

      {/* 8. Lifestyle Editorial Break: Lookbook */}
      <LookbookBanner />

      {/* 9. Nightwear Collection (if items available) */}
      {nightwear.length > 0 && (
        <ProductCarousel
          title="Nightwear"
          blurb="Sleep and lounge sets in breathable cotton, modal and silk."
          products={nightwear}
          viewAllHref="/collections/nightwear"
          tone="soft"
        />
      )}

      {/* 10. Panties Collection */}
      <ProductCarousel
        title="Panties"
        blurb="Cotton, seamless and lace briefs in every size."
        products={panties.length > 0 ? panties : products.slice(0, 8)}
        viewAllHref="/collections/panties"
      />

      {/* 11. Interactive Sizing Tool: Bra Size Calculator */}
      <SizeGuideBanner />

      {/* 12. Shapewear Collection */}
      <ProductCarousel
        title="Shapewear"
        blurb="Smoothing body suits, shaping briefs and waist cinchers."
        products={shapewear.length > 0 ? shapewear : products.slice(0, 8)}
        viewAllHref="/collections/shapewear"
        tone="soft"
      />

      {/* 13. Verified Customer Reviews Carousel */}
      <TestimonialsCarousel reviews={featuredReviews} />

      {/* 14. Buyer Guarantees & Policy Strip */}
      <USPStrip />

      {/* 15. Social Community & Newsletter */}
      <InstagramFeed />
      <NewsletterSection />
    </main>
  );
}
