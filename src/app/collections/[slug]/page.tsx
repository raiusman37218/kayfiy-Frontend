import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CollectionControls from "@/components/CollectionControls";
import { PageHeader, type Crumb } from "@/components/PageShell";
import { collectionSlugs, getLiveCollection } from "@/lib/catalog";
import { fetchDbCategories } from "@/lib/supabase";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const staticSlugs = collectionSlugs;
  try {
    const dbCats = await fetchDbCategories();
    const dbSlugs = dbCats.map((c) => c.slug);
    return Array.from(new Set([...staticSlugs, ...dbSlugs])).map((slug) => ({ slug }));
  } catch {
    return staticSlugs.map((slug) => ({ slug }));
  }
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

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Category Hierarchy Subcategory Filter Pills */}
        {collection.subcategories && collection.subcategories.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-line/60 pb-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted mr-1">
              Subcategories:
            </span>
            <span className="rounded-full bg-charcoal px-3.5 py-1 text-xs font-semibold text-white shadow-xs">
              All {collection.title}
            </span>
            {collection.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/collections/${sub.slug}`}
                className="rounded-full border border-line bg-white px-3.5 py-1 text-xs font-medium text-charcoal transition hover:border-charcoal hover:bg-blush shadow-2xs"
              >
                {sub.title}
              </Link>
            ))}
          </div>
        )}

        {/* If viewing a subcategory, show a back-to-parent badge */}
        {collection.parent && (
          <div className="mb-6 flex items-center gap-2">
            <Link
              href={`/collections/${collection.parent.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-white/80 px-3 py-1 text-xs font-medium text-charcoal transition hover:bg-blush"
            >
              <span>&larr;</span> All {collection.parent.title}
            </Link>
          </div>
        )}

        <CollectionControls products={collection.products} />
      </div>
    </main>
  );
}
