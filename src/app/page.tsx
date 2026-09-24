import HeroSlider, { type CleanHeroSlide } from "@/components/HeroSlider";
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
import { fetchDbCategories, fetchDbStoreSettings, type DbCategory } from "@/lib/supabase";
import { SECTION_BANNERS } from "@/lib/images";
import { slug, type Product } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

function parseHeroSlides(storeSettings: any): CleanHeroSlide[] {
  const fallbackImages = [
    "/banners/hero-monsoon.jpg",
    "/banners/hero-sale.jpg",
    "/banners/hero-fit.jpg",
    "/banners/hero-budget.jpg",
  ];
  const fallbackLinks = [
    "/collections/new-arrivals",
    "/collections/sale",
    "/collections/bras",
    "/collections/budget-deals",
  ];

  if (!storeSettings) {
    return fallbackImages.map((img, i) => ({
      id: `hero-${i}`,
      image: img,
      mobileImage: img,
      href: fallbackLinks[i] || "/collections/all",
    }));
  }

  const parseList = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(String).map((s) => s.trim()).filter(Boolean);
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.trim()).filter(Boolean);
      } catch {}
      return val.trim() ? [val.trim()] : [];
    }
    return [];
  };

  const desktopImages = parseList(storeSettings.hero_desktop_image);
  const mobileImages = parseList(storeSettings.hero_mobile_image);
  const slideLinks = Array.isArray(storeSettings?.announcements?.heroSlideLinks)
    ? storeSettings.announcements.heroSlideLinks
    : [];
  const defaultLink = storeSettings?.hero_primary_button_link || "/collections/all";

  // Filter out any broken placeholder references
  const validDesktop = desktopImages.filter((img: string) => !img.includes("bustaniya-campaign-hero"));
  const validMobile = mobileImages.filter((img: string) => !img.includes("bustaniya-campaign-hero"));

  const finalDesktop = validDesktop.length > 0 ? validDesktop : fallbackImages;
  const finalMobile = validMobile.length > 0 ? validMobile : finalDesktop;

  return finalDesktop.map((img: string, i: number) => ({
    id: `hero-${i}`,
    image: img,
    mobileImage: finalMobile[i] || finalMobile[0] || img,
    href: slideLinks[i] || defaultLink,
  }));
}

export default async function Home() {
  const [products, dbCategories, featuredReviews, storeSettings] = await Promise.all([
    getLiveProducts(),
    fetchDbCategories(),
    getFeaturedReviews(6),
    fetchDbStoreSettings(),
  ]);

  const heroSlides = parseHeroSlides(storeSettings);
  const isHeroEnabled = storeSettings?.hero_enabled !== false;

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

    return products.filter((p) => {
      const pCat = (p.category || "").toLowerCase();
      const pSub = (p.subcategory || "").toLowerCase();

      // Direct category or slug match
      if (pCat === catName || slug(pCat) === catSlug) return true;

      // Match child subcategories
      if (pSub && (subSlugs.has(pSub) || subNames.has(pSub) || subSlugs.has(slug(pSub)))) return true;

      return false;
    });
  }

  return (
    <main className="space-y-1 sm:space-y-2">
      {/* 1. Hero Showcase Slider (Clean Banners, No Text/Overlay) */}
      {isHeroEnabled && <HeroSlider slides={heroSlides} />}

      {/* 2. Store Perks & Live Announcement Marquee */}
      <MarqueeBanner />

      {/* 3. Circular Story Categories (Dynamic from Supabase) */}
      <CategoryStories categories={dbCategories} />

      {/* 4. Best Sellers — Product Carousel */}
      <ProductCarousel
        title="Best Sellers"
        blurb="The pieces our customers love, wear and reorder most."
        products={bestSellers.length > 0 ? bestSellers : products.slice(0, 8)}
        viewAllHref="/collections/top-selling"
      />

      {/* 5. Dynamic Categories from Admin Panel */}
      {mainCategories
        .map((cat) => {
          const subCats = dbCategories.filter(
            (c) => c.parent_slug === cat.slug && c.show_on_homepage !== false,
          );
          const catProducts = getCategoryProducts(cat, subCats);
          return { cat, subCats, catProducts };
        })
        .filter(({ catProducts }) => catProducts.length > 0)
        .map(({ cat, subCats, catProducts }, index) => {
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
