import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { PageHeader, type Crumb } from "@/components/PageShell";
import { collectionSlugs, getCollection } from "@/lib/catalog";

export function generateStaticParams() {
  return collectionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return { title: collection.title, description: collection.blurb };
}

export default async function CollectionPage({
  params,
}: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
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
