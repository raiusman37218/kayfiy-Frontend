import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BraSizeCalculator, {
  type SizedProduct,
} from "@/components/BraSizeCalculator";
import ContactForm from "@/components/ContactForm";
import { PageHeader } from "@/components/PageShell";
import { SIZE_TABLE, getStaticPage, staticPageSlugs } from "@/lib/content";
import { getLiveProducts } from "@/lib/catalog";
import { isBraProduct, sizesFor } from "@/lib/sizes";
import { slug as toSlug } from "@/lib/data";

/** Bras with their size lists, so the calculator can check availability. */
async function getBrasWithSizes(): Promise<SizedProduct[]> {
  try {
    const products = await getLiveProducts();
    return products.filter(isBraProduct).map((product) => ({
      slug: toSlug(product.name),
      name: product.name,
      image: product.image,
      price: product.price,
      sizes: sizesFor(product),
    }));
  } catch {
    // Availability is a bonus — the calculator still works without it.
    return [];
  }
}

export function generateStaticParams() {
  return staticPageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/pages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getStaticPage(slug);
  if (!page) return { title: "Page not found" };
  return { title: page.title, description: page.blurb };
}

function SizeTable() {
  return (
    <div className="overflow-x-auto rounded-3xl border border-line">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-blush/60 text-charcoal">
          <tr>
            {SIZE_TABLE.head.map((cell) => (
              <th key={cell} className="px-4 py-3 font-medium">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-muted">
          {SIZE_TABLE.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td
                  key={cell + index}
                  className={`px-4 py-3 ${index === 0 ? "text-charcoal" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ContentPage({
  params,
}: PageProps<"/pages/[slug]">) {
  const { slug } = await params;
  const page = getStaticPage(slug);
  if (!page) notFound();

  const bras = page.widget === "calculator" ? await getBrasWithSizes() : [];

  return (
    <main>
      <PageHeader
        title={page.title}
        blurb={page.blurb}
        trail={[{ label: page.title }]}
      />

      <div className={`mx-auto px-4 py-12 sm:px-6 lg:py-16 ${page.widget === "calculator" ? "max-w-4xl" : "max-w-3xl"}`}>
        {page.widget === "calculator" && <BraSizeCalculator products={bras} />}
        {page.widget === "contact" && <ContactForm />}
        {page.widget === "size-table" && <SizeTable />}

        <div className={page.widget ? "mt-12 space-y-10" : "space-y-10"}>
          {page.blocks.map((block) => (
            <section key={block.heading ?? block.body?.[0]}>
              {block.heading && (
                <h2 className="font-serif text-2xl text-charcoal">
                  {block.heading}
                </h2>
              )}
              {block.body?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-3 text-sm leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
              {block.list && (
                <ul className="mt-3 space-y-2">
                  {block.list.map((item) => (
                    <li
                      key={item}
                      className="ml-5 list-disc text-sm leading-relaxed text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
