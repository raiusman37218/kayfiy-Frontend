"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageShell";
import { useWishlist } from "@/components/useWishlist";
import { useCart } from "@/components/useCart";
import { HeartIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/data";

export default function WishlistPage() {
  const { items, ready, remove } = useWishlist();
  const { add } = useCart();

  return (
    <main>
      <PageHeader
        title="Wishlist"
        blurb="The pieces you've saved for later."
        trail={[{ label: "Wishlist" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {!ready ? (
          <p className="py-16 text-center text-sm text-muted">Loading…</p>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <HeartIcon className="mx-auto h-10 w-10 text-muted-soft" />
            <p className="mt-4 text-sm text-muted">
              Nothing saved yet — tap the heart on any product to keep it here.
            </p>
            <Link
              href="/collections/all"
              className="mt-6 inline-block rounded-full bg-[#7A2A3D] px-7 py-3 text-xs font-bold tracking-[0.16em] text-white uppercase transition hover:bg-[#5C1C2C]"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {items.map((item) => (
              <article key={item.slug} className="group">
                <Link href={`/products/${item.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush shadow-sm">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1024px) 23vw, (min-width: 640px) 30vw, 45vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-sm font-medium text-charcoal transition group-hover:text-[#7A2A3D]">
                    {item.name}
                  </h2>
                </Link>
                <p className="mt-1 text-sm font-bold text-charcoal">
                  {formatPrice(item.price)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      add({
                        slug: item.slug,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        size: "Standard",
                      })
                    }
                    className="rounded-full bg-[#7A2A3D] px-4 py-2 text-[10px] font-bold tracking-[0.14em] text-white uppercase transition hover:bg-[#5C1C2C] cursor-pointer"
                  >
                    Add to bag
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    className="rounded-full border border-line px-4 py-2 text-[10px] font-bold tracking-[0.14em] text-muted uppercase transition hover:border-charcoal hover:text-charcoal cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
