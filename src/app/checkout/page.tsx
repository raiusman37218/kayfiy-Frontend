"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/useCart";
import { PageHeader } from "@/components/PageShell";
import { formatPrice } from "@/lib/data";

const FREE_SHIPPING_OVER = 3500;
const SHIPPING_FLAT = 199;

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Other",
];

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-rose";

export default function CheckoutPage() {
  const { lines, subtotal, ready, clear } = useCart();
  const [reference, setReference] = useState<string | null>(null);
  const [payment, setPayment] = useState("cod");

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  if (reference) {
    return (
      <main>
        <PageHeader
          title="Order Placed"
          blurb="A confirmation is on its way to your inbox."
          trail={[{ label: "Checkout" }]}
        />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <p className="font-serif text-3xl text-charcoal">Thank you</p>
          <p className="mt-3 text-sm text-muted">
            Your Lisset order is confirmed. We pack Monday to Saturday and you
            will get a tracking link as soon as it ships.
          </p>
          <p className="mt-6 inline-block rounded-2xl bg-blush px-5 py-3 text-sm text-charcoal">
            Order reference <strong>{reference}</strong>
          </p>
          <div className="mt-8">
            <Link
              href="/collections/all"
              className="inline-block rounded-full bg-charcoal px-8 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        title="Checkout"
        blurb="Cash on delivery across Pakistan, or pay by bank transfer."
        trail={[{ label: "Bag", href: "/cart" }, { label: "Checkout" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {ready && lines.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-2xl text-charcoal">
              There is nothing to check out
            </p>
            <Link
              href="/collections/all"
              className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose"
            >
              Shop All Products
            </Link>
          </div>
        ) : (
          <form
            className="grid gap-10 lg:grid-cols-[1fr_380px]"
            onSubmit={(event) => {
              event.preventDefault();
              setReference(`LS-${Date.now().toString().slice(-6)}`);
              clear();
            }}
          >
            <div className="space-y-8">
              <section>
                <h2 className="font-serif text-2xl text-charcoal">
                  Contact
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="text-xs text-muted">
                      Email
                    </label>
                    <input id="email" type="email" required className={`mt-1 ${field}`} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs text-muted">
                      Mobile number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="03XX XXXXXXX"
                      className={`mt-1 ${field}`}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-charcoal">
                  Delivery Address
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="text-xs text-muted">
                      First name
                    </label>
                    <input id="first-name" required className={`mt-1 ${field}`} />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="text-xs text-muted">
                      Last name
                    </label>
                    <input id="last-name" required className={`mt-1 ${field}`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="text-xs text-muted">
                      Street address
                    </label>
                    <input id="address" required className={`mt-1 ${field}`} />
                  </div>
                  <div>
                    <label htmlFor="city" className="text-xs text-muted">
                      City
                    </label>
                    <select id="city" required className={`mt-1 ${field}`}>
                      {CITIES.map((city) => (
                        <option key={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="postcode" className="text-xs text-muted">
                      Postal code (optional)
                    </label>
                    <input id="postcode" className={`mt-1 ${field}`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="text-xs text-muted">
                      Delivery notes (optional)
                    </label>
                    <textarea id="notes" rows={3} className={`mt-1 ${field}`} />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-charcoal">Payment</h2>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      id: "cod",
                      label: "Cash on delivery",
                      hint: "Pay the rider when your parcel arrives.",
                    },
                    {
                      id: "bank",
                      label: "Bank transfer",
                      hint: "We email account details after you place the order.",
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
                        payment === option.id
                          ? "border-rose bg-blush/50"
                          : "border-line"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={payment === option.id}
                        onChange={() => setPayment(option.id)}
                        className="mt-1 accent-[#b76e79]"
                      />
                      <span>
                        <span className="block text-sm text-charcoal">
                          {option.label}
                        </span>
                        <span className="block text-xs text-muted">
                          {option.hint}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted">
                  Card payments are handled on a secure payment page after you
                  confirm — we never ask for card details on this form.
                </p>
              </section>
            </div>

            <aside className="h-fit rounded-3xl bg-blush/50 p-6 lg:sticky lg:top-28">
              <h2 className="font-serif text-2xl text-charcoal">Your Order</h2>

              <ul className="mt-5 space-y-4">
                {lines.map((line) => (
                  <li
                    key={`${line.slug}-${line.size}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="text-charcoal">{line.name}</p>
                      <p className="text-xs text-muted">
                        Size {line.size} · Qty {line.qty}
                      </p>
                    </div>
                    <span className="text-sm text-charcoal">
                      {formatPrice(line.price * line.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
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
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-charcoal px-8 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose"
              >
                Place Order
              </button>
              <Link
                href="/cart"
                className="mt-4 block text-center text-xs text-rose underline-offset-4 hover:underline"
              >
                Back to bag
              </Link>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}
