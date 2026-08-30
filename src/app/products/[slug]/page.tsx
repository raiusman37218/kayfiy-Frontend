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
          {/* Product Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-charcoal sm:text-3xl lg:text-4xl leading-tight">
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
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-charcoal/85 font-normal">
            {product.description ||
              "Cut from breathable, skin-friendly fabric and finished with flat seams so nothing digs in. Designed and fit-tested in Pakistan for long, warm days — the kind of piece you forget you put on."}
          </p>

          {/* Share buttons */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted font-medium">Share:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} on KAYFIY! ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-charcoal transition-all hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 hover:scale-110"
              aria-label="Share on WhatsApp"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => { if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(typeof window !== 'undefined' ? window.location.href : ''); }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-charcoal transition-all hover:border-[#C4526E] hover:text-[#C4526E] hover:bg-blush hover:scale-110"
              aria-label="Copy link"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 00-6.364-6.364L4.757 8.313a4.5 4.5 0 003.182 7.687" />
              </svg>
            </button>
          </div>

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
            <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-charcoal">
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
