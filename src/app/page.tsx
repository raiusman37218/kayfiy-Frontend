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
import { fetchDbCategories, type DbCategory } from "@/lib/supabase";
import { SECTION_BANNERS } from "@/lib/images";
import { slug, type Product } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const [products, dbCategories, featuredReviews] = await Promise.all([
    getLiveProducts(),
    fetchDbCategories(),
    getFeaturedReviews(6),
  ]);

  const bestSellers = products.filter((p) => p.bestsellere || p.price > 1600);

  // Filter dynamic main categories from Supabase (excluding meta collections like 'all', 'top-selling')
  const excludedSlugs = new Set(["all", "top-selling", "best-sellers"]);
  const mainCategories = dbCategories
    .filter((c) => !c.parent_slug && c.show_on_homepage !== false && !excludedSlugs.has(c.slug))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // Helper to match products for a given category & its subcategories
  function getCategoryProducts(cat: DbCategory, subCats: DbCategory[]): Product[] {
    const catName = cat.name.toLowerCase();
    const catSlug = cat.slug.toLowerCase();
    const subSlugs = new Set(subCats.map((s) => s.slug.toLowerCase()));
    const subNames = new Set(subCats.map((s) => s.name.toLowerCase()));

    const matched = products.filter((p) => {
      const pCat = (p.category || "").toLowerCase();
      const pSub = ((p as any).subcategory || "").toLowerCase();

      // Direct category or slug match
      if (pCat === catName || pCat === catSlug || slug(pCat) === catSlug || pCat.includes(catSlug)) return true;
      if (pSub === catSlug || pSub === catName) return true;

      // Match child subcategories
      if (subSlugs.has(pSub) || subNames.has(pSub) || subSlugs.has(pCat) || subNames.has(pCat)) return true;

      // Fallback regex matching for initial catalog
      if (catSlug === "bras" && /bra/i.test(p.name)) return true;
      if (catSlug === "bra-sets" && /set/i.test(p.name) && /bra/i.test(p.name)) return true;
      if (catSlug === "panties" && /panty|panties|brief/i.test(p.name)) return true;
      if (catSlug === "shapewear" && /shaper|shapewear|suit|cincher|belt/i.test(p.name)) return true;
      if ((catSlug === "nightwear" || catSlug === "pj-sets") && /night|robe|pyjama|silk|satin/i.test(p.name)) return true;

      return false;
    });

    return matched.length > 0 ? matched : products.slice(0, 8);
  }

  return (
    <main className="space-y-1 sm:space-y-2">
      {/* 1. Hero Showcase Slider */}
      <HeroSlider />

      {/* 2. Store Perks & Live Announcement Marquee */}
      <MarqueeBanner />

      {/* 3. Circular Story Categories (Dynamic from Supabase) */}
      <CategoryStories />

      {/* 4. Best Sellers — Product Carousel */}
      <ProductCarousel
        title="Best Sellers"
        blurb="The pieces our customers love, wear and reorder most."
        products={bestSellers.length > 0 ? bestSellers : products.slice(0, 8)}
        viewAllHref="/collections/top-selling"
      />

      {/* 5. Dynamic Categories from Admin Panel */}
      {mainCategories.map((cat, index) => {
        const subCats = dbCategories.filter(
          (c) => c.parent_slug === cat.slug && c.show_on_homepage !== false,
        );
        const catProducts = getCategoryProducts(cat, subCats);
        const tabs = subCats.length > 0 ? ["All", ...subCats.map((s) => s.name)] : undefined;
        const tone = index % 2 === 1 ? "soft" : "plain";

        return (
          <div key={cat.id || cat.slug}>
            {/* Interspersed Banner 1: After the first category */}
            {index === 1 && (
              <PromoBanner
                banner={SECTION_BANNERS.braSets}
                badge="Luxury Collection"
                title="Lace & Satin Bra Sets"
                subtitle="Coordinated bra and brief sets tailored for flawless contouring, all-day breathability, and pure confidence."
                ctaText="Shop Bra Sets"
                href="/collections/bra-sets"
              />
            )}

            {/* Interspersed Banner 2: Mid-way through categories */}
            {index === 3 && <LookbookBanner />}

            {/* Category Product Carousel with Admin Subcategory Tabs */}
            <ProductCarousel
              title={cat.name}
              blurb={cat.description || `Browse our latest ${cat.name.toLowerCase()} collection.`}
              products={catProducts}
              tabs={tabs}
              viewAllHref={`/collections/${cat.slug}`}
              tone={tone}
            />
          </div>
        );
      })}

      {/* 6. Interactive Sizing Tool: Bra Size Calculator */}
      <SizeGuideBanner />

      {/* 7. Verified Customer Reviews Carousel */}
      <TestimonialsCarousel reviews={featuredReviews} />

      {/* 8. Buyer Guarantees & Policy Strip */}
      <USPStrip />

      {/* 9. Social Community & Newsletter */}
      <InstagramFeed />
      <NewsletterSection />
    </main>
  );
}
