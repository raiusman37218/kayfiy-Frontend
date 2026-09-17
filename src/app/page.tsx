import HeroSlider from "@/components/HeroSlider";
import CategoryTiles from "@/components/CategoryTiles";
import ProductCarousel from "@/components/ProductCarousel";
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

  return (
    <main>
      <HeroSlider />
      <CategoryTiles />
      <USPStrip />

      <ProductCarousel
        title="Best Sellers"
        blurb="The pieces our customers reorder most."
        banner={SECTION_BANNERS.bestSellers}
        products={bestSellers.length > 0 ? bestSellers : products.slice(0, 8)}
      />
      <ProductCarousel
        title="Bras"
        blurb="Padded, non-padded, wired and sports — sizes 30A to 44DD."
        banner={SECTION_BANNERS.bras}
        products={bras.length > 0 ? bras : products.slice(0, 8)}
        viewAllHref="/collections/bras"
        tone="soft"
      />
      <ProductCarousel
        title="Bra Sets"
        blurb="Matched bra and brief sets, everyday to bridal."
        banner={SECTION_BANNERS.braSets}
        products={braSets.length > 0 ? braSets : products.slice(0, 8)}
        viewAllHref="/collections/bra-sets"
      />
      <ProductCarousel
        title="Shapewear"
        blurb="Smoothing body suits, shaping briefs and belts."
        banner={SECTION_BANNERS.shapewear}
        products={shapewear.length > 0 ? shapewear : products.slice(0, 8)}
        viewAllHref="/collections/shapewear"
        tone="soft"
      />
      <ProductCarousel
        title="Panties"
        blurb="Cotton, seamless and lace briefs in every size."
        banner={SECTION_BANNERS.panties}
        products={panties.length > 0 ? panties : products.slice(0, 8)}
        viewAllHref="/collections/panties"
      />

      <LookbookBanner />
      <SizeGuideBanner />
      <TestimonialsCarousel reviews={featuredReviews} />
      <InstagramFeed />
      <NewsletterSection />
    </main>
  );
}
