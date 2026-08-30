"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/useCart";
import { formatPrice } from "@/lib/data";
import { fetchDbStoreSettings } from "@/lib/supabase";
import KayfiyLogo from "@/components/KayfiyLogo";

const inputClass =
  "w-full rounded-md border border-[#D9D9D9] bg-white px-3.5 py-2.5 text-sm text-[#333333] placeholder:text-[#737373] outline-none transition focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]";

export default function CheckoutPage() {
  const { lines, subtotal, ready, clear } = useCart();
  const [reference, setReference] = useState<string | null>(null);
  const [payment, setPayment] = useState("cod");
  const [billingSame, setBillingSame] = useState("same");
  const [shippingFee, setShippingFee] = useState(250);
  const [freeThreshold, setFreeThreshold] = useState(3500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Discount code state
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percent: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    contact: "",
    emailNews: true,
    country: "Pakistan",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postcode: "",
    phone: "",
    saveInfo: false,
    textNews: false,
    notes: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchDbStoreSettings();
        if (settings) {
          if (typeof settings.cod_delivery_fee_pkr === "number") {
            setShippingFee(Number(settings.cod_delivery_fee_pkr));
          }
          if (typeof settings.free_delivery_threshold_pkr === "number") {
            setFreeThreshold(Number(settings.free_delivery_threshold_pkr));
          }
        }
      } catch (e) {
        console.warn("Could not load checkout settings:", e);
      }
    }
    loadSettings();
  }, []);

  const discountAmount = appliedDiscount
    ? Math.round((subtotal * appliedDiscount.percent) / 100)
    : 0;

  const discountedSubtotal = subtotal - discountAmount;
  const isFreeShipping = subtotal >= freeThreshold;
  const shipping = subtotal === 0 || isFreeShipping ? 0 : shippingFee;
  const total = discountedSubtotal + shipping;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError(null);
    const code = discountCode.trim().toUpperCase();
    if (!code) return;

    if (code === "WELCOME10" || code === "KAYFIY10") {
      setAppliedDiscount({ code, percent: 10 });
    } else if (code === "KAYFIY5" || code === "COMFORT5") {
      setAppliedDiscount({ code, percent: 5 });
    } else {
      setDiscountError("Enter a valid discount code");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const email = formData.contact.includes("@")
      ? formData.contact
      : `${formData.phone || "customer"}@kayfiy.pk`;
    const phone = formData.phone || formData.contact;
    const fullAddress = formData.apartment
      ? `${formData.address}, ${formData.apartment}`
      : formData.address;

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: fullAddress,
          city: formData.city || "Karachi",
          postcode: formData.postcode,
          notes: formData.notes,
          paymentMethod: payment,
          discountCode: appliedDiscount?.code,
          discountAmount,
          items: lines.map((l) => ({
            id: l.id,
            name: l.name,
            price: l.price,
            qty: l.qty,
            size: l.size,
            image: l.image,
            slug: l.slug,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to place order. Please try again.");
      }

      setReference(data.orderNumber);
      clear();
    } catch (err: any) {
      console.error("Order submission failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reference) {
    return (
      <main className="min-h-screen bg-[#FBFBFB] py-16 px-4">
        <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-8 sm:p-10 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Order Confirmed</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Thank you for your purchase!</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your order reference number is:
          </p>
          
          <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 py-3 px-6 text-center font-mono text-xl font-bold text-gray-900">
            {reference}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            We have received your order and will contact you via SMS / phone for delivery updates.
          </p>

          <Link
            href="/collections/all"
            className="mt-6 inline-block rounded-md bg-[#1773B0] px-8 py-3 text-xs font-semibold text-white uppercase tracking-wider hover:bg-[#135d8f] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#333333]">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Exactly matching the Shopify Screenshot       */}
          {/* ========================================================= */}
          <div className="px-4 py-8 sm:px-8 lg:col-span-7 lg:py-10 lg:pr-12">
            {/* Store Brand Header on Checkout */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <Link
                href="/"
                className="inline-block transition hover:opacity-85"
                aria-label="Go to KAYFIY Home"
              >
                <KayfiyLogo size="md" />
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-1 text-xs font-medium text-[#1773B0] hover:underline"
              >
                ← Return to bag
              </Link>
            </div>

            {ready && lines.length === 0 ? (
              <div className="py-16 text-center">
                <h2 className="text-lg font-medium text-gray-900">Your cart is empty</h2>
                <Link
                  href="/collections/all"
                  className="mt-4 inline-block rounded-md bg-[#1773B0] px-6 py-2.5 text-xs font-medium text-white hover:bg-[#135d8f]"
                >
                  Return to shop
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                {/* 1. Contact Section */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[#333333]">Contact</h2>
                    <Link href="/account" className="text-xs text-[#1773B0] hover:underline">
                      Sign in
                    </Link>
                  </div>

                  <div className="relative">
                    <input
                      id="contact"
                      name="contact"
                      type="text"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      placeholder="Email or mobile phone number"
                      className={inputClass}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                      <span className="text-xs font-bold border border-gray-400 rounded-full h-4 w-4 flex items-center justify-center">?</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-[#545454] cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNews"
                      checked={formData.emailNews}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-[#1773B0] focus:ring-[#1773B0]"
                    />
                    <span>Email me with news and offers</span>
                  </label>
                </section>

                {/* 2. Delivery Section */}
                <section className="space-y-3 pt-2">
                  <h2 className="text-lg font-medium text-[#333333]">Delivery</h2>

                  {/* Country/Region box */}
                  <div className="relative rounded-md border border-[#D9D9D9] bg-white px-3.5 pt-1.5 pb-1">
                    <label htmlFor="country" className="block text-[10px] text-[#737373]">
                      Country/Region
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-[#333333] outline-none cursor-pointer"
                    >
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>

                  {/* First name & Last name */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="First name"
                      className={inputClass}
                    />
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className={inputClass}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Address"
                      className={inputClass}
                    />
                  </div>

                  {/* Apartment */}
                  <div>
                    <input
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="Apartment, suite, etc. (optional)"
                      className={inputClass}
                    />
                  </div>

                  {/* City & Postal code */}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                      className={inputClass}
                    />
                    <input
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="Postal code (optional)"
                      className={inputClass}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone"
                      className={inputClass}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                      <span className="text-xs font-bold border border-gray-400 rounded-full h-4 w-4 flex items-center justify-center">?</span>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#545454] cursor-pointer">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-[#1773B0] focus:ring-[#1773B0]"
                      />
                      <span>Save this information for next time</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-[#545454] cursor-pointer">
                      <input
                        type="checkbox"
                        name="textNews"
                        checked={formData.textNews}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-[#1773B0] focus:ring-[#1773B0]"
                      />
                      <span>Text me with news and offers</span>
                    </label>
                  </div>
                </section>

                {/* 3. Shipping method Section */}
                <section className="space-y-3 pt-2">
                  <h2 className="text-lg font-medium text-[#333333]">Shipping method</h2>

                  <div className="rounded-md border border-[#1773B0] bg-[#F4F9FC] p-3.5 flex items-center justify-between text-sm">
                    <span className="text-[#333333] font-normal">Standard Shipping</span>
                    <span className="font-semibold text-[#333333]">
                      {isFreeShipping ? "Free" : `Rs ${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                </section>

                {/* 4. Payment Section */}
                <section className="space-y-3 pt-2">
                  <div>
                    <h2 className="text-lg font-medium text-[#333333]">Payment</h2>
                    <p className="text-xs text-[#737373]">All transactions are secure and encrypted.</p>
                  </div>

                  <div className="rounded-md border border-[#D9D9D9] overflow-hidden divide-y divide-[#D9D9D9]">
                    
                    {/* PAYFAST */}
                    <div className={payment === "payfast" ? "border-2 border-[#1773B0] rounded-t-md" : ""}>
                      <label className="flex items-center justify-between p-3.5 cursor-pointer bg-white">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_choice"
                            value="payfast"
                            checked={payment === "payfast"}
                            onChange={() => setPayment("payfast")}
                            className="h-4 w-4 text-[#1773B0] focus:ring-[#1773B0]"
                          />
                          <span className="text-xs sm:text-sm font-medium text-[#333333]">
                            PAYFAST(Pay via Debit/Credit/Wallet/Bank Account)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="rounded bg-[#1A1F71] px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider">VISA</span>
                          <span className="rounded bg-[#EB001B] px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider">MC</span>
                          <span className="rounded bg-[#007AC1] px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider">UnionPay</span>
                        </div>
                      </label>
                      {payment === "payfast" && (
                        <div className="bg-[#F8F9FA] px-4 py-3.5 border-t border-[#D9D9D9] text-xs text-[#545454] leading-relaxed text-center">
                          You&apos;ll be redirected to PAYFAST(Pay via Debit/Credit/Wallet/Bank Account) to complete your purchase.
                        </div>
                      )}
                    </div>

                    {/* Cash on Delivery */}
                    <div>
                      <label className="flex items-center justify-between p-3.5 cursor-pointer bg-white">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_choice"
                            value="cod"
                            checked={payment === "cod"}
                            onChange={() => setPayment("cod")}
                            className="h-4 w-4 text-[#1773B0] focus:ring-[#1773B0]"
                          />
                          <span className="text-xs sm:text-sm text-[#333333]">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                      </label>
                      {payment === "cod" && (
                        <div className="bg-[#F8F9FA] px-4 py-3.5 border-t border-[#D9D9D9] text-xs text-[#545454] leading-relaxed">
                          Pay with cash upon delivery at your doorstep. Please keep the exact amount ready for the rider.
                        </div>
                      )}
                    </div>

                    {/* Bank Deposit */}
                    <div>
                      <label className="flex items-center justify-between p-3.5 cursor-pointer bg-white">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_choice"
                            value="bank"
                            checked={payment === "bank"}
                            onChange={() => setPayment("bank")}
                            className="h-4 w-4 text-[#1773B0] focus:ring-[#1773B0]"
                          />
                          <span className="text-xs sm:text-sm text-[#333333]">
                            Bank Deposit
                          </span>
                        </div>
                      </label>
                      {payment === "bank" && (
                        <div className="bg-[#F8F9FA] px-4 py-3.5 border-t border-[#D9D9D9] text-xs text-[#545454] leading-relaxed">
                          Account details will be sent via SMS / WhatsApp immediately for direct bank transfer.
                        </div>
                      )}
                    </div>

                    {/* Jazz Cash / Easy paisa */}
                    <div>
                      <label className="flex items-center justify-between p-3.5 cursor-pointer bg-white">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_choice"
                            value="wallet"
                            checked={payment === "wallet"}
                            onChange={() => setPayment("wallet")}
                            className="h-4 w-4 text-[#1773B0] focus:ring-[#1773B0]"
                          />
                          <span className="text-xs sm:text-sm text-[#333333]">
                            Jazz Cash / Easy paisa
                          </span>
                        </div>
                      </label>
                      {payment === "wallet" && (
                        <div className="bg-[#F8F9FA] px-4 py-3.5 border-t border-[#D9D9D9] text-xs text-[#545454] leading-relaxed">
                          Transfer to our official JazzCash / EasyPaisa account for instant verification and dispatch.
                        </div>
                      )}
                    </div>

                  </div>
                </section>

                {/* 5. Billing address Section */}
                <section className="space-y-3 pt-2">
                  <h2 className="text-lg font-medium text-[#333333]">Billing address</h2>

                  <div className="rounded-md border border-[#D9D9D9] overflow-hidden divide-y divide-[#D9D9D9]">
                    <label className="flex items-center gap-3 p-3.5 cursor-pointer bg-white">
                      <input
                        type="radio"
                        name="billing_choice"
                        value="same"
                        checked={billingSame === "same"}
                        onChange={() => setBillingSame("same")}
                        className="h-4 w-4 text-[#1773B0] focus:ring-[#1773B0]"
                      />
                      <span className="text-xs sm:text-sm text-[#333333]">Same as shipping address</span>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 cursor-pointer bg-white">
                      <input
                        type="radio"
                        name="billing_choice"
                        value="different"
                        checked={billingSame === "different"}
                        onChange={() => setBillingSame("different")}
                        className="h-4 w-4 text-[#1773B0] focus:ring-[#1773B0]"
                      />
                      <span className="text-xs sm:text-sm text-[#333333]">Use a different billing address</span>
                    </label>
                  </div>
                </section>

                {/* 6. Complete Order Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-[#1773B0] py-3.5 px-6 text-sm font-semibold text-white uppercase tracking-wider shadow-sm transition hover:bg-[#135d8f] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Processing...</span>
                    ) : (
                      <span>Complete order • {formatPrice(total)}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Exactly matching the Shopify Screenshot      */}
          {/* ========================================================= */}
          <aside className="border-t border-[#E1E1E1] bg-[#FAFAFA] px-4 py-8 sm:px-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:py-10">
            <div className="lg:sticky lg:top-8 space-y-6">
              
              {/* Product list */}
              <ul className="divide-y divide-[#E1E1E1]/60">
                {lines.map((line) => (
                  <li key={`${line.id || line.slug}-${line.size}`} className="flex items-center gap-3.5 py-3">
                    {/* Square Thumbnail with black floating badge */}
                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-white border border-[#D9D9D9]">
                      <Image
                        src={
                          line.image && (line.image.startsWith("http") || line.image.startsWith("/"))
                            ? line.image
                            : "/banners/hero-monsoon.jpg"
                        }
                        alt={line.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white shadow-xs">
                        {line.qty}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-normal text-[#333333] truncate leading-tight">
                        {line.name}
                      </p>
                      <p className="text-xs text-[#737373] mt-0.5">
                        {line.size}
                      </p>
                    </div>

                    <span className="text-sm font-normal text-[#333333]">
                      Rs {(line.price * line.qty).toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Discount code */}
              <form onSubmit={handleApplyDiscount} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Discount code"
                  className="flex-1 rounded-md border border-[#D9D9D9] bg-white px-3.5 py-2.5 text-sm text-[#333333] placeholder:text-[#737373] outline-none focus:border-[#1773B0]"
                />
                <button
                  type="submit"
                  className="rounded-md bg-[#EBEBEB] px-4 py-2.5 text-xs font-semibold text-[#545454] transition hover:bg-gray-800 hover:text-white cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {appliedDiscount && (
                <p className="text-xs text-emerald-600 font-medium">
                  ✓ Code <strong>{appliedDiscount.code}</strong> applied ({appliedDiscount.percent}% off)
                </p>
              )}
              {discountError && (
                <p className="text-xs text-red-600">{discountError}</p>
              )}

              {/* Price Breakdown */}
              <dl className="space-y-3 border-t border-[#E1E1E1] pt-4 text-sm text-[#333333]">
                <div className="flex justify-between">
                  <dt className="text-[#545454]">Subtotal</dt>
                  <dd className="font-normal">Rs {subtotal.toLocaleString("en-PK", { minimumFractionDigits: 2 })}</dd>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>Discount</dt>
                    <dd>-Rs {discountAmount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}</dd>
                  </div>
                )}

                <div className="flex justify-between">
                  <dt className="text-[#545454]">Shipping</dt>
                  <dd className="font-normal">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-medium">Free</span>
                    ) : (
                      `Rs ${shippingFee.toLocaleString("en-PK", { minimumFractionDigits: 2 })}`
                    )}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between border-t border-[#E1E1E1] pt-4 text-base">
                  <dt className="font-medium text-[#333333]">Total</dt>
                  <dd className="text-lg font-bold text-[#333333]">
                    <span className="text-xs text-[#737373] font-normal mr-1.5">PKR</span>
                    Rs {total.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  </dd>
                </div>
              </dl>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
