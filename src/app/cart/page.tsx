"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/useCart";
import { PageHeader } from "@/components/PageShell";
import { formatPrice } from "@/lib/data";

const FREE_SHIPPING_OVER = 3500;
const SHIPPING_FLAT = 199;

export default function CartPage() {
  const { lines, subtotal, count, ready, setQty, remove, clear } = useCart();

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;

  return (
    <main>
      <PageHeader
        title="Your Bag"
        blurb={
          ready && count > 0
            ? `${count} ${count === 1 ? "item" : "items"} ready to go.`
            : "Everything you add is saved on this device."
        }
        trail={[{ label: "Bag" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {!ready ? (
          <p className="py-16 text-center text-sm text-muted">Loading your bag…</p>
        ) : lines.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-2xl text-charcoal">
              Your bag is empty
            </p>
            <p className="mt-2 text-sm text-muted">
              Start with the pieces our customers reorder most.
            </p>
            <Link
              href="/collections/top-selling"
              className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose"
            >
              Shop Best Sellers
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-line border-y border-line">
              {lines.map((line) => (
                <li
                  key={`${line.slug}-${line.size}`}
                  className="flex gap-4 py-6"
                >
                  <Link
                    href={`/products/${line.slug}`}
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-blush sm:h-32 sm:w-28"
                  >
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap justify-between gap-2">
                      <Link
                        href={`/products/${line.slug}`}
                        className="text-sm text-charcoal transition hover:text-rose"
                      >
                        {line.name}
                      </Link>
                      <span className="text-sm text-charcoal">
                        {formatPrice(line.price * line.qty)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">Size {line.size}</p>

                    <div className="mt-auto flex items-center gap-4 pt-4">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          onClick={() =>
                            setQty(line.slug, line.size, line.qty - 1)
                          }
                          aria-label={`Decrease quantity of ${line.name}`}
                          className="px-3 py-1.5 text-charcoal transition hover:text-rose"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQty(line.slug, line.size, line.qty + 1)
                          }
                          aria-label={`Increase quantity of ${line.name}`}
                          className="px-3 py-1.5 text-charcoal transition hover:text-rose"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(line.slug, line.size)}
                        className="text-xs text-muted underline-offset-4 transition hover:text-rose hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-3xl bg-blush/50 p-6 lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl text-charcoal">Summary</h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="text-charcoal">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="text-charcoal">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base">
                  <dt className="text-charcoal">Total</dt>
                  <dd className="font-medium text-charcoal">
                    {formatPrice(subtotal + shipping)}
                  </dd>
                </div>
              </dl>

              {shipping > 0 && (
                <p className="mt-3 text-xs text-muted">
                  Spend {formatPrice(FREE_SHIPPING_OVER - subtotal)} more for
                  free delivery.
                </p>
              )}

              <Link
                href="/checkout"
                className="mt-6 block rounded-full bg-charcoal px-8 py-3.5 text-center text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-4 flex justify-between text-xs">
                <Link
                  href="/collections/all"
                  className="text-rose underline-offset-4 hover:underline"
                >
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="text-muted underline-offset-4 hover:text-rose hover:underline"
                >
                  Clear bag
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
