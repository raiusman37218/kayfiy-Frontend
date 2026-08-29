import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { PageHeader, type Crumb } from "@/components/PageShell";
import { collectionSlugs, getLiveCollection } from "@/lib/catalog";

export const revalidate = 60;

export function generateStaticParams() {
  return collectionSlugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getLiveCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return { title: collection.title, description: collection.blurb };
}

export default async function CollectionPage({
  params,
}: Props) {
  const { slug } = await params;
  const collection = await getLiveCollection(slug);
  if (!collection) notFound();

  const trail: Crumb[] = collection.parent
    ? [
        { label: collection.parent.title, href: `/collections/${collection.parent.slug}` },
        { label: collection.title },
      ]
    : [{ label: collection.title }];

  return (
    <main>
      <PageHeader
        title={collection.title}
        blurb={collection.blurb}
        trail={trail}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="mb-6 text-xs tracking-[0.14em] text-muted uppercase">
          {collection.products.length}{" "}
          {collection.products.length === 1 ? "product" : "products"}
        </p>
        <ProductGrid products={collection.products} />
      </div>
    </main>
  );
}
