"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/useCart";
import { PageHeader } from "@/components/PageShell";
import { formatPrice } from "@/lib/data";
import { fetchDbStoreSettings } from "@/lib/supabase";

const FALLBACK_IMAGE = "/banners/hero-monsoon.jpg";

const safeImage = (src?: string) =>
  src && (src.startsWith("http") || src.startsWith("/")) ? src : FALLBACK_IMAGE;

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
        // Keep the defaults if settings can't be read.
      }
    }
    loadSettings();
  }, []);

  const isFreeShipping = subtotal >= freeThreshold;
  const shipping = subtotal === 0 || isFreeShipping ? 0 : shippingFee;
  const total = subtotal + shipping;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeThreshold) * 100),
  );
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
          <p className="py-16 text-center text-sm text-muted">
            Loading your bag…
          </p>
        ) : lines.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-line bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blush text-maroon">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-charcoal">
              Your bag is empty
            </p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
              Explore our best selling comfort wear and find your true fit.
            </p>
            <Link
              href="/collections/top-selling"
              className="mt-7 inline-block rounded-full bg-maroon px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-maroon-dark"
            >
              Shop Best Sellers
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
            <div>
              {/* Free delivery progress */}
              <div
                className={`mb-5 rounded-2xl border p-4 sm:px-5 ${
                  isFreeShipping
                    ? "border-[#CFE0D2] bg-[#EEF4EE]"
                    : "border-[#EDC9D0] bg-[#FCF0F2]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {isFreeShipping ? (
                    <p className="flex items-center gap-2 text-xs font-semibold text-[#33573C] sm:text-sm">
                      <svg
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Free nationwide delivery unlocked
                    </p>
                  ) : (
                    <>
                      <p className="text-xs text-charcoal sm:text-sm">
                        Add{" "}
                        <strong className="font-semibold text-maroon">
                          {formatPrice(remainingForFree)}
                        </strong>{" "}
                        more for free nationwide delivery
                      </p>
                      <span className="shrink-0 text-xs font-bold text-muted">
                        {progressPercent}%
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFreeShipping ? "bg-[#3F6B4A]" : "bg-maroon"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Line items */}
              <ul className="space-y-3">
                {lines.map((line) => (
                  <li
                    key={`${line.slug}-${line.size}`}
                    className="rounded-2xl border border-line bg-white p-3 shadow-2xs transition hover:shadow-sm sm:p-4"
                  >
                    <div className="flex gap-3.5 sm:gap-4">
                      <Link
                        href={`/products/${line.slug}`}
                        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-blush sm:h-28 sm:w-24"
                      >
                        <Image
                          src={safeImage(line.image)}
                          alt={line.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${line.slug}`}
                              className="line-clamp-2 text-sm font-medium text-charcoal transition hover:text-maroon sm:text-base"
                            >
                              {line.name}
                            </Link>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                              <span className="rounded-md bg-blush px-2 py-0.5 text-[11px] font-medium text-charcoal">
                                Size {line.size}
                              </span>
                              <span className="text-[11px] text-muted">
                                {formatPrice(line.price)} each
                              </span>
                            </div>
                          </div>

                          <span className="shrink-0 text-sm font-semibold text-charcoal sm:text-base">
                            {formatPrice(line.price * line.qty)}
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-line">
                            <button
                              type="button"
                              onClick={() =>
                                setQty(line.slug, line.size, line.qty - 1)
                              }
                              aria-label={`Decrease quantity of ${line.name}`}
                              className="cursor-pointer px-3 py-1 text-charcoal transition hover:text-maroon"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-xs font-bold">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQty(line.slug, line.size, line.qty + 1)
                              }
                              aria-label={`Increase quantity of ${line.name}`}
                              className="cursor-pointer px-3 py-1 text-charcoal transition hover:text-maroon"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(line.slug, line.size)}
                            title={`Remove ${line.name}`}
                            aria-label={`Remove ${line.name} from your bag`}
                            className="flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] text-muted transition hover:bg-blush hover:text-maroon"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.35 9m-4.78 0L9.26 9M18.5 6.5l-.84 12.02A2.25 2.25 0 0115.42 20.6H8.58a2.25 2.25 0 01-2.24-2.08L5.5 6.5M9.75 6.5V4.75A1.25 1.25 0 0111 3.5h2a1.25 1.25 0 011.25 1.25V6.5M4 6.5h16"
                              />
                            </svg>
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between text-xs">
                <Link
                  href="/collections/all"
                  className="font-medium text-maroon underline-offset-4 hover:underline"
                >
                  ← Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="cursor-pointer text-muted underline-offset-4 transition hover:text-maroon hover:underline"
                >
                  Clear entire bag
                </button>
              </div>
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-28">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-charcoal">
                Order Summary
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">
                    Subtotal
                    <span className="ml-1 text-xs">
                      ({count} {count === 1 ? "item" : "items"})
                    </span>
                  </dt>
                  <dd className="font-medium text-charcoal">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="font-medium text-charcoal">
                    {isFreeShipping ? (
                      <span className="font-bold text-[#3F6B4A]">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="font-[family-name:var(--font-heading)] text-base font-bold text-charcoal">
                    Total
                  </dt>
                  <dd className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-charcoal">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-maroon px-8 py-4 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-md transition-all duration-300 hover:bg-maroon-dark hover:shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <span className="text-sm">→</span>
              </Link>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#CFE0D2] bg-[#EEF4EE] p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDE9DE] text-[#3F6B4A]">
                  <svg
                    className="h-4.5 w-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2C4A33]">
                    Arrives in 2–4 working days
                  </p>
                  <p className="text-[11px] text-[#33573C]">
                    Nationwide, tracked delivery
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 border-t border-line pt-4 text-[11px] text-muted">
                {[
                  "Cash on delivery available nationwide",
                  "100% discreet & private packaging",
                  "7-day size exchange guarantee",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-[#3F6B4A]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
