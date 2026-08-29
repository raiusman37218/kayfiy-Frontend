import HeroSlider from "@/components/HeroSlider";
import CategoryTiles from "@/components/CategoryTiles";
import ProductCarousel from "@/components/ProductCarousel";
import SizeGuideBanner from "@/components/SizeGuideBanner";
import { bestSellers, braSets, bras, panties, shapewear } from "@/lib/data";
import { SECTION_BANNERS } from "@/lib/images";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <CategoryTiles />

      <ProductCarousel
        title="Best Sellers"
        blurb="The pieces our customers reorder most."
        banner={SECTION_BANNERS.bestSellers}
        products={bestSellers}
      />
      <ProductCarousel
        title="Bras"
        blurb="Padded, non-padded, wired and sports — sizes 30A to 44DD."
        banner={SECTION_BANNERS.bras}
        products={bras}
        viewAllHref="/collections/bras"
      />
      <ProductCarousel
        title="Bra Sets"
        blurb="Matched bra and brief sets, everyday to bridal."
        banner={SECTION_BANNERS.braSets}
        products={braSets}
        viewAllHref="/collections/bra-sets"
      />
      <ProductCarousel
        title="Shapewear"
        blurb="Smoothing body suits, shaping briefs and belts."
        banner={SECTION_BANNERS.shapewear}
        products={shapewear}
        viewAllHref="/collections/shapewear"
      />
      <ProductCarousel
        title="Panties"
        blurb="Cotton, seamless and lace briefs in every size."
        banner={SECTION_BANNERS.panties}
        products={panties}
        viewAllHref="/collections/panties"
      />

      <SizeGuideBanner />
    </main>
  );
}
