import HeroSlider from "@/components/HeroSlider";
import CategoryTiles from "@/components/CategoryTiles";
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
    <main className="space-y-2 sm:space-y-4">
      {/* Top Showcase Slider */}
      <HeroSlider />

      {/* Shop By Category Tiles */}
      <CategoryTiles />

      {/* 1. Best Sellers — Clean Product Carousel */}
      <ProductCarousel
        title="Best Sellers"
        blurb="The pieces our customers love and reorder most."
        products={bestSellers.length > 0 ? bestSellers : products.slice(0, 8)}
        viewAllHref="/collections/top-selling"
      />

      {/* Interspersed Standalone Promo Banner */}
      <PromoBanner
        banner={SECTION_BANNERS.braSets}
        badge="Special Feature"
        title="Lace & Satin Bra Sets"
        subtitle="Matched bra and brief sets engineered for seamless contouring, breathability, and luxurious comfort."
        ctaText="Shop Bra Sets"
        href="/collections/bra-sets"
      />

      {/* 2. Bras — Clean Product Carousel */}
      <ProductCarousel
        title="Bras"
        blurb="Padded, non-padded, wired and sports — sizes 30A to 44DD."
        products={bras.length > 0 ? bras : products.slice(0, 8)}
        viewAllHref="/collections/bras"
        tone="soft"
      />

      {/* 3. Bra Sets — Clean Product Carousel */}
      <ProductCarousel
        title="Bra Sets"
        blurb="Matched bra and brief sets, everyday to bridal."
        products={braSets.length > 0 ? braSets : products.slice(0, 8)}
        viewAllHref="/collections/bra-sets"
      />

      {/* Mid-Page Lifestyle Banner Break */}
      <LookbookBanner />

      {/* 4. Nightwear or Shapewear — Clean Product Carousel */}
      {nightwear.length > 0 && (
        <ProductCarousel
          title="Nightwear"
          blurb="Sleep and lounge sets in breathable cotton, modal and silk."
          products={nightwear}
          viewAllHref="/collections/nightwear"
          tone="soft"
        />
      )}

      {/* 5. Shapewear — Clean Product Carousel */}
      <ProductCarousel
        title="Shapewear"
        blurb="Smoothing body suits, shaping briefs and waist cinchers."
        products={shapewear.length > 0 ? shapewear : products.slice(0, 8)}
        viewAllHref="/collections/shapewear"
        tone={nightwear.length > 0 ? "plain" : "soft"}
      />

      {/* 6. Panties — Clean Product Carousel */}
      <ProductCarousel
        title="Panties"
        blurb="Cotton, seamless and lace briefs in every size."
        products={panties.length > 0 ? panties : products.slice(0, 8)}
        viewAllHref="/collections/panties"
      />

      {/* Interactive Size Guide Banner Break */}
      <SizeGuideBanner />

      {/* Customer Reviews & Testimonials Carousel */}
      <TestimonialsCarousel reviews={featuredReviews} />

      {/* Store Trust & Policy Strip */}
      <USPStrip />

      {/* Social & Community */}
      <InstagramFeed />
      <NewsletterSection />
    </main>
  );
}
