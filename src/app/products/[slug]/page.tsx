import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToBag from "@/components/AddToBag";
import ProductGrid from "@/components/ProductGrid";
import ProductGallery from "@/components/ProductGallery";
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

        <div className="lg:pt-4">
          <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">
            {product.name}
          </h1>

          {product.articleNumber && (
            <p className="mt-1 text-xs tracking-wider text-muted uppercase">
              SKU: {product.articleNumber}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            {onSale && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compareAt!)}
              </span>
            )}
            <span
              className={`text-2xl ${onSale ? "text-rose" : "text-charcoal"}`}
            >
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="rounded-full bg-blush px-3 py-1 text-xs text-charcoal">
                Save {discountPercent(product.price, product.compareAt!)}%
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted">
            {product.description ||
              "Cut from breathable, skin-friendly fabric and finished with flat seams so nothing digs in. Designed and fit-tested in Pakistan for long, warm days — the kind of piece you forget you put on."}
          </p>

          <AddToBag product={product} />

          <dl className="mt-10 divide-y divide-line border-t border-line text-sm">
            {[
              ["Fabric", "Cotton-modal blend with elastane for stretch"],
              ["Care", "Hand wash cold, dry flat, do not bleach"],
              ["Delivery", "2–4 working days nationwide, free over Rs. 3,500"],
              ["Returns", "7-day exchange on unworn items with tags"],
            ].map(([term, detail]) => (
              <div key={term} className="flex gap-6 py-3.5">
                <dt className="w-28 shrink-0 text-charcoal">{term}</dt>
                <dd className="text-muted">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">
              You May Also Like
            </h2>
            <Link
              href="/collections/all"
              className="border-b border-rose/40 pb-0.5 text-xs tracking-[0.14em] text-rose uppercase transition hover:border-rose"
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
