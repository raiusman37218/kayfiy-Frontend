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

  // 1. New Arrivals: 12 products
  const newArrivals = products
    .filter((p) => p.new || p.createdAt)
    .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
  const newArrivalsList = (newArrivals.length >= 12 ? newArrivals : products).slice(0, 12);

  // 2. Best Sellers: 8 products (with view all linking to /collections/best-sellers for all best sellers)
  const bestSellers = products.filter((p) => p.bestsellere || p.price > 1600);
  const bestSellersList = (bestSellers.length >= 8 ? bestSellers : products).slice(0, 8);

  // 3. Testimonial review screenshots uploaded from Admin
  const testimonialScreenshots: string[] = Array.isArray(storeSettings?.announcements?.testimonialScreenshots)
    ? storeSettings.announcements.testimonialScreenshots
    : [];

  return (
    <main className="space-y-4 sm:space-y-6 pb-6">
      {/* 1. Hero Showcase Slider (Clean Banners, No Text/Overlay) */}
      {isHeroEnabled && <HeroSlider slides={heroSlides} />}

      {/* 2. Store Perks & Live Announcement Marquee */}
      <MarqueeBanner />

      {/* 3. Shop by Categories (5 items in view, large moving carousel) */}
      <CategoryStories categories={dbCategories} />

      {/* 4. New Arrivals (Exact 12 products) */}
      <ProductCarousel
        title="New Arrivals"
        blurb="Freshly dropped pieces designed for pure comfort, breathability and ease."
        products={newArrivalsList}
        viewAllHref="/collections/new-arrivals"
      />

      {/* 5. In-Between Banner 1: Luxury Collection / Bra Sets */}
      <PromoBanner
        banner={SECTION_BANNERS.braSets}
        badge="Luxury Collection"
        title="Lace & Satin Bra Sets"
        subtitle="Coordinated bra and brief sets tailored for flawless contouring, all-day breathability, and pure confidence."
        ctaText="Shop Bra Sets"
        href="/collections/bra-sets"
      />

      {/* 6. Best Sellers (8 products with View All showing all top-selling) */}
      <ProductCarousel
        title="Best Sellers"
        blurb="The pieces our customers love, wear and reorder most."
        products={bestSellersList}
        viewAllHref="/collections/best-sellers"
        tone="soft"
      />

      {/* 7. Interactive Bra Size Calculator (Proper Placement & Fit Guide) */}
      <SizeGuideBanner />

      {/* 8. In-Between Banner 2: Lookbook / Seasonal Banner */}
      <LookbookBanner />

      {/* 9. Testimonials (Admin-managed WhatsApp review screenshots + verified ratings) */}
      <TestimonialsCarousel
        screenshots={testimonialScreenshots}
        reviews={featuredReviews}
      />

      {/* 10. Instagram Reels (Vertical 9:16 video reel cards) */}
      <InstagramFeed />

      {/* 11. Buyer Guarantees & Policy Strip */}
      <USPStrip />

      {/* 12. Social Community & Newsletter */}
      <NewsletterSection />
    </main>
  );
}
