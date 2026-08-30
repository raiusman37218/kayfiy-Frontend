import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToBag from "@/components/AddToBag";
import ProductGrid from "@/components/ProductGrid";
import ProductGallery from "@/components/ProductGallery";
import ProductTrustBadges from "@/components/ProductTrustBadges";
import { Breadcrumbs } from "@/components/PageShell";
import { allProducts, findLiveProduct, getLiveProducts, relatedTo } from "@/lib/catalog";
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
  const related = relatedTo(product, allLive, 4);

  const productImages = product.images && product.images.length > 0
    ? product.images
    : Array.from(new Set([product.image, product.hoverImage].filter(Boolean)));

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Breadcrumbs
          trail={[
            { label: "All Products", href: "/collections/all" },
            { label: product.name },
          ]}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <ProductGallery
          images={productImages}
          name={product.name}
          onSale={onSale}
          isAvailable={product.instock !== false && (product.stockQuantity ?? 1) > 0}
        />

        <div className="lg:pt-2">
          {/* Product Title - Crisp Bold Modern Sans-serif in Solid Black */}
          <h1 className="font-sans text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl leading-tight">
            {product.name}
          </h1>

          {product.articleNumber && (
            <p className="mt-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              SKU: {product.articleNumber}
            </p>
          )}

          {/* Pricing Section */}
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span
              className={`font-sans text-2xl sm:text-3xl font-extrabold ${
                onSale ? "text-[#C4526E]" : "text-black"
              }`}
            >
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="font-sans text-base sm:text-lg text-gray-400 line-through font-medium">
                {formatPrice(product.compareAt!)}
              </span>
            )}
            {onSale && (
              <span className="rounded-full bg-[#FFF0F3] border border-[#F2D4DA] px-3 py-1 text-xs font-bold text-[#C4526E]">
                Save {discountPercent(product.price, product.compareAt!)}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-black/90 font-normal">
            {product.description ||
              "Cut from breathable, skin-friendly fabric and finished with flat seams so nothing digs in. Designed and fit-tested in Pakistan for long, warm days — the kind of piece you forget you put on."}
          </p>

          <AddToBag product={product} />

          {/* Dedicated Illustrated Trust & Feature Badges */}
          <ProductTrustBadges />

          {/* Specifications / Accordions */}
          <dl className="mt-8 divide-y divide-gray-200 border-t border-gray-200 text-sm">
            {[
              ["Fabric", "Cotton-modal blend with elastane for stretch"],
              ["Care", "Hand wash cold, dry flat, do not bleach"],
              ["Delivery", "2–4 working days nationwide, free over Rs. 3,500"],
              ["Returns", "7-day exchange on unworn items with tags"],
            ].map(([term, detail]) => (
              <div key={term} className="flex gap-6 py-3.5">
                <dt className="w-28 shrink-0 font-semibold text-black">{term}</dt>
                <dd className="text-black/80">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-black">
              You May Also Like
            </h2>
            <Link
              href="/collections/all"
              className="border-b border-black pb-0.5 text-xs font-bold tracking-[0.14em] text-black uppercase transition hover:text-[#C4526E] hover:border-[#C4526E]"
            >
              View All
            </Link>
          </div>
          <ProductGrid products={related} />
        </div>
      </section>
    </main>
  );
}
