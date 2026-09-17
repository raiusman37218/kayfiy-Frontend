import HeroSlider from "@/components/HeroSlider";
import MarqueeBanner from "@/components/MarqueeBanner";
import CategoryStories from "@/components/CategoryStories";
import CategoryTiles from "@/components/CategoryTiles";
import ProductCarousel from "@/components/ProductCarousel";
import PromoBanner from "@/components/PromoBanner";
import PromoBannerSplit from "@/components/PromoBannerSplit";
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
    <main className="space-y-2 sm:space-y-4">
      {/* 1. Top Showcase Slider */}
      <HeroSlider />

      {/* 2. Continuous Announcement Marquee Ticker */}
      <MarqueeBanner />

      {/* 3. Instagram Story-Style Circular Categories Strip */}
      <CategoryStories />

      {/* 4. Editorial Shop By Category Tiles */}
      <CategoryTiles />

      {/* 5. Best Sellers — Product Carousel with Filter Tabs */}
      <ProductCarousel
        title="Best Sellers"
        blurb="The pieces our customers love, wear and reorder most."
        products={bestSellers.length > 0 ? bestSellers : products.slice(0, 8)}
        tabs={["All", "Padded", "Push-Up", "Lace"]}
        viewAllHref="/collections/top-selling"
      />

      {/* 6. Dual Editorial Promotional Banner Split */}
      <PromoBannerSplit />

      {/* 7. Bras — Clean Product Carousel with Sub-Category Tabs */}
      <ProductCarousel
        title="Bras"
        blurb="Padded, non-padded, wired and sports — crafted for sizes 30A to 44DD."
        products={bras.length > 0 ? bras : products.slice(0, 8)}
        tabs={["All", "Padded", "Push-Up", "Non-Padded", "Sports"]}
        viewAllHref="/collections/bras"
        tone="soft"
      />

      {/* 8. Bra Sets — Clean Product Carousel */}
      <ProductCarousel
        title="Bra Sets"
        blurb="Coordinated bra and brief sets, from everyday essentials to bridal."
        products={braSets.length > 0 ? braSets : products.slice(0, 8)}
        tabs={["All", "Lace", "Thin Pad", "Push Up"]}
        viewAllHref="/collections/bra-sets"
      />

      {/* 9. Mid-Page Lifestyle Editorial Break */}
      <LookbookBanner />

      {/* 10. Nightwear Collection (if available) */}
      {nightwear.length > 0 && (
        <ProductCarousel
          title="Nightwear"
          blurb="Sleep and lounge sets in breathable cotton, modal and silk."
          products={nightwear}
          viewAllHref="/collections/nightwear"
          tone="soft"
        />
      )}

      {/* 11. Shapewear Collection */}
      <ProductCarousel
        title="Shapewear"
        blurb="Smoothing body suits, shaping briefs and waist cinchers."
        products={shapewear.length > 0 ? shapewear : products.slice(0, 8)}
        viewAllHref="/collections/shapewear"
        tone={nightwear.length > 0 ? "plain" : "soft"}
      />

      {/* 12. Interspersed Standalone Promo Banner */}
      <PromoBanner
        banner={SECTION_BANNERS.shapewear}
        badge="Instant Sculpt"
        title="Flawless Silhouette Shapewear"
        subtitle="Designed for invisible all-day control and breathable comfort under traditional or western wear."
        ctaText="Explore Shapewear"
        href="/collections/shapewear"
      />

      {/* 13. Panties Collection */}
      <ProductCarousel
        title="Panties"
        blurb="Cotton, seamless and lace briefs in every size."
        products={panties.length > 0 ? panties : products.slice(0, 8)}
        viewAllHref="/collections/panties"
      />

      {/* 14. Interactive Bra Size Calculator Banner */}
      <SizeGuideBanner />

      {/* 15. Customer Reviews Carousel */}
      <TestimonialsCarousel reviews={featuredReviews} />

      {/* 16. Store Trust & Policy Strip */}
      <USPStrip />

      {/* 17. Social Community & Newsletter */}
      <InstagramFeed />
      <NewsletterSection />
    </main>
  );
}
