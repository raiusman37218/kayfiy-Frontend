import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToBag from "@/components/AddToBag";
import StickyMobileBuyBar from "@/components/StickyMobileBuyBar";
import ProductGallery from "@/components/ProductGallery";
import ProductTrustBadges from "@/components/ProductTrustBadges";
import ShareButtons from "@/components/ShareButtons";
import Accordion from "@/components/Accordion";
import RelatedProductsCarousel from "@/components/RelatedProductsCarousel";
import ReviewsSection from "@/components/ReviewsSection";
import { Breadcrumbs, type Crumb } from "@/components/PageShell";
import { allProducts, findLiveProduct, getLiveProducts, relatedTo } from "@/lib/catalog";
import { getReviewsForProduct } from "@/lib/reviews";
import { discountPercent, formatPrice, slug as slugify } from "@/lib/data";

export const revalidate = 60;

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: slugify(product.name) }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await findLiveProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: `${product.name} — ${formatPrice(product.price)} at KAYFIY.`,
  };
}

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;
  const product = await findLiveProduct(slug);
  if (!product) notFound();

  const allLive = await getLiveProducts();
  const onSale = typeof product.compareAt === "number";
  const related = relatedTo(product, allLive, 8);
  const reviews = await getReviewsForProduct(slug);

  const productImages = product.images && product.images.length > 0
    ? product.images
    : Array.from(new Set([product.image, product.hoverImage].filter(Boolean)));

  const trail: Crumb[] = [];
  if (product.category) {
    trail.push({ label: product.category, href: `/collections/${slugify(product.category)}` });
  } else {
    trail.push({ label: "All Products", href: "/collections/all" });
  }
  if (product.subcategory) {
    trail.push({ label: product.subcategory, href: `/collections/${slugify(product.subcategory)}` });
  }
  trail.push({ label: product.name });

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Breadcrumbs trail={trail} />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <ProductGallery
          images={productImages}
          name={product.name}
          slug={slug}
          price={product.price}
          onSale={onSale}
          isAvailable={product.instock !== false && (product.stockQuantity ?? 1) > 0}
        />

        <div className="lg:pt-2">
          {/* Product Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-charcoal sm:text-3xl lg:text-4xl leading-tight">
            {product.name}
          </h1>

          {product.articleNumber && (
            <p className="mt-1.5 text-xs font-semibold tracking-wider text-muted uppercase">
              SKU: {product.articleNumber}
            </p>
          )}

          {/* Pricing Section */}
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span
              className={`font-sans text-2xl sm:text-3xl font-extrabold ${
                onSale ? "text-[#7A2A3D]" : "text-black"
              }`}
            >
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="font-sans text-base sm:text-lg text-muted-soft line-through font-medium">
                {formatPrice(product.compareAt!)}
              </span>
            )}
            {onSale && (
              <span className="rounded-full bg-[#FAE8EC] border border-[#EDC9D0] px-3 py-1 text-xs font-bold text-[#7A2A3D]">
                Save {discountPercent(product.price, product.compareAt!)}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-charcoal/85 font-normal">
            {product.description ||
              "Cut from breathable, skin-friendly fabric and finished with flat seams so nothing digs in. Designed and fit-tested in Pakistan for long, warm days — the kind of piece you forget you put on."}
          </p>

          {/* Share buttons */}
          <ShareButtons productName={product.name} />

          <AddToBag product={product} />

          {/* Dedicated Illustrated Trust & Feature Badges */}
          <ProductTrustBadges />

          {/* Fabric & Care / Delivery & Returns */}
          <Accordion
            items={[
              {
                title: "Fabric & Care",
                rows: [
                  ["Fabric", "Cotton-modal blend with elastane for stretch"],
                  ["Care", "Hand wash cold, dry flat, do not bleach"],
                ],
              },
              {
                title: "Delivery & Returns",
                rows: [
                  ["Delivery", "2–4 working days nationwide, free over Rs. 3,500"],
                  ["Returns", "7-day exchange on unworn items with tags"],
                ],
              },
            ]}
          />
        </div>
      </div>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <RelatedProductsCarousel title="You May Also Like" products={related} />
          <ReviewsSection reviews={reviews} />
        </div>
      </section>

      {/* Mobile Sticky Add to Bag Bar */}
      <StickyMobileBuyBar product={product} />
    </main>
  );
}
