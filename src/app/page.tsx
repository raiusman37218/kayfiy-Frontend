import HeroSlider from "@/components/HeroSlider";
import TrustStrip from "@/components/TrustStrip";
import CategoryTiles from "@/components/CategoryTiles";
import ProductCarousel from "@/components/ProductCarousel";
import SizeGuideBanner from "@/components/SizeGuideBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import { getLiveProducts } from "@/lib/catalog";
import { SECTION_BANNERS } from "@/lib/images";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const allLive = await getLiveProducts();
  const products = allLive.filter((p) => p.instock !== false);

  const bestSellers = products.filter((p) => p.bestsellere || p.price >= 1800);
  const bras = products.filter(
    (p) =>
      (p.category?.toLowerCase() === "bras" ||
        /\b(bra|bralette|bralettes|bras)\b/i.test(p.name)) &&
      !/pad|liner|period|sanitary/i.test(p.name),
  );
  const pjSets = products.filter(
    (p) =>
      (p.category?.toLowerCase() === "pj sets" ||
        p.category?.toLowerCase() === "nightwear" ||
        /\b(pj|pjs|robe|pyjama|pyjamas|pajama|pajamas|sleepwear|nighty|nightwear)\b/i.test(p.name) ||
        (/silk|satin/i.test(p.name) && !/pad|liner|brief|bra/i.test(p.name))) &&
      !/pad|liner|period|sanitary|brief/i.test(p.name),
  );

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Carousel */}
      <HeroSlider />

      {/* 2. Customer Trust & Confidence Guarantees */}
      <TrustStrip />

      {/* 3. Shop 2 Active Categories (Bras & Pj Sets) */}
      <CategoryTiles />

      {/* 4. Trending Best Sellers */}
      <ProductCarousel
        title="Trending Best Sellers"
        blurb="The everyday luxury pieces our customers reorder most."
        banner={SECTION_BANNERS.bestSellers}
        products={bestSellers.length > 0 ? bestSellers : products.slice(0, 8)}
        viewAllHref="/collections/all"
      />

      {/* 5. The Bra Studio */}
      <ProductCarousel
        title="The Bra Studio"
        blurb="Padded, non-padded, wired, push-up and sports — sizes 30A to 44DD."
        banner={SECTION_BANNERS.bras}
        products={bras.length > 0 ? bras : products}
        viewAllHref="/collections/bras"
        tone="soft"
      />

      {/* 6. Pj Sets & Sleepwear Lounge */}
      <ProductCarousel
        title="Pj Sets & Loungewear"
        blurb="Soft satin and breathable cotton sets designed for peaceful sleep."
        banner={SECTION_BANNERS.pjSets}
        products={pjSets.length > 0 ? pjSets : products}
        viewAllHref="/collections/pj-sets"
      />

      {/* 7. Interactive Bra Size Finder Banner */}
      <SizeGuideBanner />

      {/* 8. Customer Love & Verified Reviews */}
      <TestimonialsSection />

      {/* 9. Frequently Asked Questions */}
      <FaqSection />
    </main>
  );
}
