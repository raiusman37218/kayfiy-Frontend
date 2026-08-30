"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/useCart";
import { PageHeader } from "@/components/PageShell";
import { formatPrice } from "@/lib/data";
import { fetchDbStoreSettings } from "@/lib/supabase";

export default function CartPage() {
  const { lines, subtotal, count, ready, setQty, remove, clear } = useCart();
  const [freeThreshold, setFreeThreshold] = useState(3500);
  const [shippingFee, setShippingFee] = useState(199);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchDbStoreSettings();
        if (settings) {
          if (typeof settings.free_delivery_threshold_pkr === "number") {
            setFreeThreshold(Number(settings.free_delivery_threshold_pkr));
          }
          if (typeof settings.cod_delivery_fee_pkr === "number") {
            setShippingFee(Number(settings.cod_delivery_fee_pkr));
          }
        }
      } catch {
        // fallback
      }
    }
    loadSettings();
  }, []);

  const isFreeShipping = subtotal >= freeThreshold;
  const shipping = subtotal === 0 || isFreeShipping ? 0 : shippingFee;
  const total = subtotal + shipping;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  return (
    <main>
      <PageHeader
        title="Your Bag"
        blurb={
          ready && count > 0
            ? `${count} ${count === 1 ? "item" : "items"} ready to ship.`
            : "Comfortable essentials saved to your bag."
        }
        trail={[{ label: "Bag" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {!ready ? (
          <p className="py-16 text-center text-sm text-muted">Loading your bag…</p>
        ) : lines.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blush text-[#C4526E]">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="font-serif text-3xl font-bold text-charcoal">
              Your bag is empty
            </p>
            <p className="mt-2 text-sm text-muted">
              Explore our best selling comfort wear and find your true fit.
            </p>
            <Link
              href="/collections/top-selling"
              className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-[#C4526E]"
            >
              Shop Best Sellers
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              {/* Free Shipping Progress Meter */}
              <div className="mb-6 rounded-2xl border border-[#F2D4DA] bg-[#FFF5F7] p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-charcoal">
                  {remainingForFree > 0 ? (
                    <p>
                      Add <strong className="text-[#C4526E]">{formatPrice(remainingForFree)}</strong> more for <strong>FREE Nationwide Delivery</strong> 🚚
                    </p>
                  ) : (
                    <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span>🎉</span> You've unlocked <strong>FREE Nationwide Delivery!</strong>
                    </p>
                  )}
                  <span className="text-xs font-bold text-muted">{progressPercent}%</span>
                </div>
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F5D8DF]">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      progressPercent >= 100 ? "bg-emerald-500" : "bg-[#C4526E]"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Product List */}
              <ul className="divide-y divide-line border-y border-line">
                {lines.map((line) => (
                  <li
                    key={`${line.slug}-${line.size}`}
                    className="flex gap-4 py-6"
                  >
                    <Link
                      href={`/products/${line.slug}`}
                      className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-blush sm:h-32 sm:w-28 shadow-2xs"
                    >
                      <Image
                        src={
                          line.image && (line.image.startsWith("http") || line.image.startsWith("/"))
                            ? line.image
                            : "/banners/hero-monsoon.jpg"
                        }
                        alt={line.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap justify-between gap-2">
                          <Link
                            href={`/products/${line.slug}`}
                            className="font-medium text-base text-charcoal transition hover:text-[#C4526E]"
                          >
                            {line.name}
                          </Link>
                          <span className="font-semibold text-base text-charcoal">
                            {formatPrice(line.price * line.qty)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="inline-block rounded-md bg-blush px-2.5 py-0.5 text-xs font-medium text-charcoal">
                            Size: {line.size}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() =>
                              setQty(line.slug, line.size, line.qty - 1)
                            }
                            aria-label={`Decrease quantity of ${line.name}`}
                            className="px-3.5 py-1 text-charcoal transition hover:text-[#C4526E] cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-bold">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQty(line.slug, line.size, line.qty + 1)
                            }
                            aria-label={`Increase quantity of ${line.name}`}
                            className="px-3.5 py-1 text-charcoal transition hover:text-[#C4526E] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(line.slug, line.size)}
                          className="text-xs text-muted underline-offset-4 transition hover:text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between text-xs">
                <Link
                  href="/collections/all"
                  className="text-[#C4526E] underline-offset-4 hover:underline"
                >
                  ← Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="text-muted underline-offset-4 hover:text-red-600 hover:underline cursor-pointer"
                >
                  Clear entire bag
                </button>
              </div>
            </div>

            {/* Sidebar Summary */}
            <aside className="h-fit rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm lg:sticky lg:top-28">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-charcoal">Order Summary</h2>

              <dl className="mt-6 space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-medium text-charcoal">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Estimated Delivery</dt>
                  <dd className="font-medium text-charcoal">
                    {isFreeShipping ? (
                      <span className="font-bold text-emerald-600">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-4 text-base">
                  <dt className="font-[family-name:var(--font-heading)] font-bold text-charcoal">Estimated Total</dt>
                  <dd className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-charcoal">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              {/* Estimated Delivery */}
              <div className="mt-5 rounded-2xl bg-[#F0FDF4] border border-emerald-200 p-3.5 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Estimated Delivery</p>
                  <p className="text-[11px] text-emerald-700">2–4 working days nationwide</p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C4526E] py-4 px-8 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-md transition-all duration-300 hover:bg-[#A83853] hover:shadow-lg hover:scale-[1.01] cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <span className="text-sm">→</span>
              </Link>

              <div className="mt-6 space-y-2 text-[11px] text-muted border-t border-line pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Cash on delivery available nationwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>100% Discreet & private packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>7-Day size exchange guarantee</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
