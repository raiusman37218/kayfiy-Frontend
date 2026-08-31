"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/components/useCart";
import { formatPrice } from "@/lib/data";
import { fetchDbStoreSettings } from "@/lib/supabase";
import KayfiyLogo from "@/components/KayfiyLogo";

const inputClass =
  "w-full rounded-xl border border-[#E0D7D7] bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted-soft outline-none transition-all duration-200 focus:border-[#7A2A3D] focus:ring-2 focus:ring-[#7A2A3D]/15 hover:border-[#D0C5C5]";

/* ─── Confetti ─── */
const CONFETTI_COLORS = ["#7A2A3D", "#faedef", "#c07e8c", "#c2a15f", "#b76e79", "#efd3da", "#fbd9de", "#2b2724"];

function ConfettiCelebration() {
  const [particles, setParticles] = useState<
    { id: number; left: string; color: string; delay: string; size: number; rotation: number }[]
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: `${Math.random() * 2}s`,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: p.delay,
            width: p.size,
            height: p.size,
            borderRadius: p.size > 8 ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Checkmark ─── */
function AnimatedCheckmark() {
  return (
    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center">
      <svg viewBox="0 0 52 52" className="h-24 w-24">
        <circle
          className="animate-circle-draw"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          stroke="#7A2A3D"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="animate-draw-check"
          fill="none"
          stroke="#7A2A3D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
    </div>
  );
}

/* ─── Timeline Step ─── */
function TimelineStep({
  step,
  title,
  desc,
  isActive,
  isLast,
}: {
  step: number;
  title: string;
  desc: string;
  isActive: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
            isActive
              ? "bg-[#7A2A3D] text-white shadow-md scale-110"
              : "border-2 border-[#E0D7D7] text-muted-soft bg-white"
          }`}
        >
          {isActive ? "✓" : step}
        </div>
        {!isLast && (
          <div
            className={`mt-1 w-0.5 flex-1 min-h-6 transition-colors duration-500 ${
              isActive ? "bg-[#7A2A3D]" : "bg-[#E0D7D7]"
            }`}
          />
        )}
      </div>
      <div className="pb-6">
        <p className={`text-sm font-semibold ${isActive ? "text-charcoal" : "text-muted-soft"}`}>
          {title}
        </p>
        <p className={`mt-0.5 text-xs ${isActive ? "text-muted" : "text-muted-soft"}`}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Thank You Page ─── */
function ThankYouPage({
  reference,
  orderItems,
  orderTotal,
}: {
  reference: string;
  orderItems: { name: string; size: string; qty: number; price: number; image: string }[];
  orderTotal: number;
}) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 4);
  const formattedDate = estimatedDate.toLocaleDateString("en-PK", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FDF4F6] via-cream to-cream">
      {showConfetti && <ConfettiCelebration />}

      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in">
          <Link href="/" className="inline-block mb-6">
            <KayfiyLogo size="md" />
          </Link>
        </div>

        {/* Main Confirmation Card */}
        <div className="rounded-3xl border border-[#EDC9D0]/60 bg-white p-8 sm:p-10 shadow-lg animate-slide-up">
          <AnimatedCheckmark />

          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#FAE8EC] px-4 py-1.5 text-xs font-bold tracking-wider text-[#7A2A3D] uppercase border border-[#EDC9D0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7A2A3D] animate-pulse-soft" />
              Order Confirmed
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
              Thank you for your order!
            </h1>
            <p className="mt-3 text-sm text-muted max-w-md mx-auto leading-relaxed">
              We&apos;ve received your order and will start processing it right away. You&apos;ll receive updates via SMS.
            </p>
          </div>

          {/* Order Reference */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#FCF0F2] to-[#F9E4E8] border border-[#EDC9D0]/50 p-5 text-center">
            <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">Order Reference</p>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-extrabold text-charcoal tracking-wider">
              {reference}
            </p>
          </div>

          {/* Order Items Summary */}
          {orderItems.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-bold tracking-wider text-charcoal uppercase mb-4">
                Order Summary
              </h3>
              <ul className="divide-y divide-[#EDC9D0]/40 rounded-2xl border border-[#E0D7D7]/60 overflow-hidden">
                {orderItems.map((item, idx) => (
                  <li key={`${item.name}-${item.size}-${idx}`} className="flex items-center gap-3.5 p-3.5 bg-white hover:bg-[#FDF4F6] transition">
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-blush border border-[#E0D7D7]">
                      <Image
                        src={
                          item.image && (item.image.startsWith("http") || item.image.startsWith("/"))
                            ? item.image
                            : "/banners/hero-monsoon.jpg"
                        }
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
                      <p className="text-xs text-muted">
                        Size: {item.size} · Qty: {item.qty}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-charcoal shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-sm font-medium text-muted">Total</span>
                <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-charcoal">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>
          )}

          {/* Estimated Delivery */}
          <div className="mt-8 rounded-2xl bg-[#F4F8F3] border border-[#CFE0D2] p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDE9DE] text-[#3F6B4A]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2C4A33]">Estimated Delivery</p>
              <p className="text-xs text-[#33573C]">{formattedDate} (2–4 working days)</p>
            </div>
          </div>

          {/* What Happens Next Timeline */}
          <div className="mt-8">
            <h3 className="text-xs font-bold tracking-wider text-charcoal uppercase mb-5">
              What Happens Next
            </h3>
            <TimelineStep
              step={1}
              title="Order Received"
              desc="We've got your order — our team is on it!"
              isActive={true}
              isLast={false}
            />
            <TimelineStep
              step={2}
              title="Processing & Packing"
              desc="Your items are being carefully packed in discreet packaging."
              isActive={false}
              isLast={false}
            />
            <TimelineStep
              step={3}
              title="Shipped"
              desc="Your order is on its way! You'll get an SMS with tracking info."
              isActive={false}
              isLast={false}
            />
            <TimelineStep
              step={4}
              title="Delivered"
              desc="Your KAYFIY comfort wear arrives at your doorstep."
              isActive={false}
              isLast={true}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-slide-up stagger-3">
          <Link
            href="/collections/all"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#7A2A3D] px-6 py-4 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all duration-300 hover:bg-[#5C1C2C] hover:shadow-lg"
          >
            Continue Shopping
          </Link>
          <a
            href={`https://wa.me/923000000000?text=${encodeURIComponent(`Hi KAYFIY! I just placed order ${reference}. Can you confirm?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald-500 bg-[#EEF4EE] px-6 py-4 text-xs font-bold tracking-wider text-[#33573C] uppercase transition-all duration-300 hover:bg-[#3F6B4A] hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Track via WhatsApp
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted animate-fade-in stagger-5">
          <span className="flex items-center gap-1.5">
            <span className="text-[#3F6B4A] font-bold">✓</span> 100% Discreet Packaging
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#3F6B4A] font-bold">✓</span> 7-Day Size Exchange
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#3F6B4A] font-bold">✓</span> Cash on Delivery
          </span>
        </div>
      </div>
    </main>
  );
}

/* ─── Loading Spinner ─── */
function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin-slow" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function CheckoutPage() {
  const { lines, subtotal, ready, clear } = useCart();
  const [reference, setReference] = useState<string | null>(null);
  const [payment, setPayment] = useState("cod");
  const [billingSame, setBillingSame] = useState("same");
  const [shippingFee, setShippingFee] = useState(250);
  const [freeThreshold, setFreeThreshold] = useState(3500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preserve order info for thank-you page
  const orderSnapshot = useRef<{
    items: { name: string; size: string; qty: number; price: number; image: string }[];
    total: number;
  }>({ items: [], total: 0 });

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

    // Snapshot the order for the thank-you page
    orderSnapshot.current = {
      items: lines.map((l) => ({
        name: l.name,
        size: l.size,
        qty: l.qty,
        price: l.price,
        image: l.image,
      })),
      total,
    };

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

  /* ═══ THANK YOU PAGE ═══ */
  if (reference) {
    return (
      <ThankYouPage
        reference={reference}
        orderItems={orderSnapshot.current.items}
        orderTotal={orderSnapshot.current.total}
      />
    );
  }

  /* ═══ CHECKOUT FORM ═══ */
  return (
    <div className="min-h-screen bg-white font-sans text-charcoal">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          
          {/* LEFT COLUMN */}
          <div className="px-4 py-8 sm:px-8 lg:col-span-7 lg:py-10 lg:pr-12">
            {/* Store Brand Header */}
            <div className="mb-6 flex items-center justify-between border-b border-[#E0D7D7] pb-4 animate-fade-in">
              <Link
                href="/"
                className="inline-block transition hover:opacity-85"
                aria-label="Go to KAYFIY Home"
              >
                <KayfiyLogo size="md" />
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-1 text-xs font-medium text-[#7A2A3D] hover:underline underline-offset-4 transition"
              >
                ← Return to bag
              </Link>
            </div>

            {ready && lines.length === 0 ? (
              <div className="py-16 text-center animate-slide-up">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blush text-[#7A2A3D]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-charcoal">Your cart is empty</h2>
                <Link
                  href="/collections/all"
                  className="mt-4 inline-block rounded-xl bg-[#7A2A3D] px-6 py-2.5 text-xs font-semibold text-white uppercase tracking-wider hover:bg-[#5C1C2C] transition shadow-sm"
                >
                  Return to shop
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center gap-2 animate-scale-in">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errorMessage}
                  </div>
                )}

                {/* 1. Contact Section */}
                <section className="space-y-3 animate-slide-up stagger-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-charcoal">Contact</h2>
                    <Link href="/account" className="text-xs text-[#7A2A3D] hover:underline underline-offset-4 font-medium">
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-soft">
                      <span className="text-[10px] font-bold border border-line rounded-full h-4 w-4 flex items-center justify-center">?</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 text-xs text-muted cursor-pointer group">
                    <input
                      type="checkbox"
                      name="emailNews"
                      checked={formData.emailNews}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-line text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                    />
                    <span className="group-hover:text-charcoal transition">Email me with news and offers</span>
                  </label>
                </section>

                {/* 2. Delivery Section */}
                <section className="space-y-3 pt-2 animate-slide-up stagger-2">
                  <h2 className="text-lg font-semibold text-charcoal">Delivery</h2>

                  <div className="relative rounded-xl border border-[#E0D7D7] bg-white px-4 pt-2 pb-1.5 transition hover:border-[#D0C5C5]">
                    <label htmlFor="country" className="block text-[10px] text-muted font-medium">
                      Country/Region
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-charcoal outline-none cursor-pointer"
                    >
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>

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

                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Address"
                    className={inputClass}
                  />

                  <input
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    className={inputClass}
                  />

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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-soft">
                      <span className="text-[10px] font-bold border border-line rounded-full h-4 w-4 flex items-center justify-center">?</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 text-xs text-muted cursor-pointer group">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-line text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                      />
                      <span className="group-hover:text-charcoal transition">Save this information for next time</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-muted cursor-pointer group">
                      <input
                        type="checkbox"
                        name="textNews"
                        checked={formData.textNews}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-line text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                      />
                      <span className="group-hover:text-charcoal transition">Text me with news and offers</span>
                    </label>
                  </div>
                </section>

                {/* 3. Shipping method */}
                <section className="space-y-3 pt-2 animate-slide-up stagger-3">
                  <h2 className="text-lg font-semibold text-charcoal">Shipping method</h2>

                  <div className="rounded-xl border-2 border-[#7A2A3D] bg-[#FCF0F2] p-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7A2A3D] text-white">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-charcoal font-medium">Standard Shipping</span>
                    </div>
                    <span className="font-bold text-charcoal">
                      {isFreeShipping ? (
                        <span className="text-[#3F6B4A]">Free</span>
                      ) : (
                        `Rs ${shippingFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </section>

                {/* 4. Payment Section */}
                <section className="space-y-3 pt-2 animate-slide-up stagger-4">
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal">Payment</h2>
                    <p className="text-xs text-muted mt-0.5">All transactions are secure and encrypted.</p>
                  </div>

                  <div className="rounded-xl border border-[#E0D7D7] overflow-hidden divide-y divide-[#E0D7D7]">
                    
                    {/* PAYFAST */}
                    <div className={payment === "payfast" ? "ring-2 ring-[#7A2A3D] ring-inset rounded-t-xl" : ""}>
                      <label className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-[#FEF8F9] transition">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_choice"
                            value="payfast"
                            checked={payment === "payfast"}
                            onChange={() => setPayment("payfast")}
                            className="h-4 w-4 text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                          />
                          <span className="text-xs sm:text-sm font-medium text-charcoal">
                            PAYFAST (Debit/Credit/Wallet/Bank)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="rounded bg-[#1A1F71] px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider">VISA</span>
                          <span className="rounded bg-[#EB001B] px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider">MC</span>
                          <span className="rounded bg-[#007AC1] px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider">UnionPay</span>
                        </div>
                      </label>
                      {payment === "payfast" && (
                        <div className="bg-[#FCF0F2] px-4 py-3.5 border-t border-[#E0D7D7] text-xs text-muted leading-relaxed text-center">
                          You&apos;ll be redirected to PAYFAST to complete your purchase securely.
                        </div>
                      )}
                    </div>

                    {/* Cash on Delivery */}
                    <div className={payment === "cod" ? "ring-2 ring-[#7A2A3D] ring-inset" : ""}>
                      <label className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-[#FEF8F9] transition">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_choice"
                            value="cod"
                            checked={payment === "cod"}
                            onChange={() => setPayment("cod")}
                            className="h-4 w-4 text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                          />
                          <span className="text-xs sm:text-sm text-charcoal font-medium">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                      </label>
                      {payment === "cod" && (
                        <div className="bg-[#FCF0F2] px-4 py-3.5 border-t border-[#E0D7D7] text-xs text-muted leading-relaxed">
                          Pay with cash upon delivery at your doorstep. Please keep the exact amount ready for the rider.
                        </div>
                      )}
                    </div>

                    {/* Bank Deposit */}
                    <div className={payment === "bank" ? "ring-2 ring-[#7A2A3D] ring-inset" : ""}>
                      <label className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-[#FEF8F9] transition">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_choice"
                            value="bank"
                            checked={payment === "bank"}
                            onChange={() => setPayment("bank")}
                            className="h-4 w-4 text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                          />
                          <span className="text-xs sm:text-sm text-charcoal font-medium">
                            Bank Deposit
                          </span>
                        </div>
                      </label>
                      {payment === "bank" && (
                        <div className="bg-[#FCF0F2] px-4 py-3.5 border-t border-[#E0D7D7] text-xs text-muted leading-relaxed">
                          Account details will be sent via SMS / WhatsApp immediately for direct bank transfer.
                        </div>
                      )}
                    </div>

                    {/* Jazz Cash / Easy paisa */}
                    <div className={payment === "wallet" ? "ring-2 ring-[#7A2A3D] ring-inset rounded-b-xl" : ""}>
                      <label className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-[#FEF8F9] transition">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment_choice"
                            value="wallet"
                            checked={payment === "wallet"}
                            onChange={() => setPayment("wallet")}
                            className="h-4 w-4 text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                          />
                          <span className="text-xs sm:text-sm text-charcoal font-medium">
                            Jazz Cash / Easy paisa
                          </span>
                        </div>
                      </label>
                      {payment === "wallet" && (
                        <div className="bg-[#FCF0F2] px-4 py-3.5 border-t border-[#E0D7D7] text-xs text-muted leading-relaxed">
                          Transfer to our official JazzCash / EasyPaisa account for instant verification and dispatch.
                        </div>
                      )}
                    </div>

                  </div>
                </section>

                {/* 5. Billing address */}
                <section className="space-y-3 pt-2 animate-slide-up stagger-5">
                  <h2 className="text-lg font-semibold text-charcoal">Billing address</h2>

                  <div className="rounded-xl border border-[#E0D7D7] overflow-hidden divide-y divide-[#E0D7D7]">
                    <label className={`flex items-center gap-3 p-4 cursor-pointer bg-white hover:bg-[#FEF8F9] transition ${billingSame === "same" ? "ring-2 ring-[#7A2A3D] ring-inset rounded-t-xl" : ""}`}>
                      <input
                        type="radio"
                        name="billing_choice"
                        value="same"
                        checked={billingSame === "same"}
                        onChange={() => setBillingSame("same")}
                        className="h-4 w-4 text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                      />
                      <span className="text-xs sm:text-sm text-charcoal">Same as shipping address</span>
                    </label>

                    <label className={`flex items-center gap-3 p-4 cursor-pointer bg-white hover:bg-[#FEF8F9] transition ${billingSame === "different" ? "ring-2 ring-[#7A2A3D] ring-inset rounded-b-xl" : ""}`}>
                      <input
                        type="radio"
                        name="billing_choice"
                        value="different"
                        checked={billingSame === "different"}
                        onChange={() => setBillingSame("different")}
                        className="h-4 w-4 text-[#7A2A3D] focus:ring-[#7A2A3D] accent-[#7A2A3D]"
                      />
                      <span className="text-xs sm:text-sm text-charcoal">Use a different billing address</span>
                    </label>
                  </div>
                </section>

                {/* 6. Order Note */}
                <section className="animate-slide-up stagger-6">
                  <label htmlFor="orderNotes" className="text-xs font-semibold text-charcoal tracking-wider uppercase">
                    Delivery Instructions <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <textarea
                    id="orderNotes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Nearby landmark, gate instructions, or preferred timing..."
                    className={`${inputClass} mt-2 resize-none`}
                  />
                </section>

                {/* 7. Submit Button */}
                <div className="pt-4 animate-slide-up stagger-7">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full rounded-2xl bg-[#7A2A3D] py-4 px-6 text-sm font-bold text-white uppercase tracking-wider shadow-lg transition-all duration-300 hover:bg-[#5C1C2C] hover:shadow-xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        <span>Processing your order...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Complete order · {formatPrice(total)}</span>
                      </>
                    )}
                  </button>

                  {/* Trust line below button */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <span className="text-[#3F6B4A]">✓</span> Cash on Delivery
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[#3F6B4A]">✓</span> Discreet Packaging
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[#3F6B4A]">✓</span> 7-Day Exchange
                    </span>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN — Order Summary Sidebar */}
          <aside className="border-t border-[#E0D7D7] bg-[#FAFAF8] px-4 py-8 sm:px-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:py-10">
            <div className="lg:sticky lg:top-8 space-y-6">
              
              {/* Product list */}
              <ul className="divide-y divide-[#E0D7D7]/60">
                {lines.map((line) => (
                  <li key={`${line.id || line.slug}-${line.size}`} className="flex items-center gap-3.5 py-3.5">
                    <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white border border-[#E0D7D7] shadow-2xs">
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
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[11px] font-bold text-white shadow-sm">
                        {line.qty}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate leading-tight">
                        {line.name}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {line.size}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-charcoal">
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
                  className="flex-1 rounded-xl border border-[#E0D7D7] bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted-soft outline-none transition focus:border-[#7A2A3D] focus:ring-2 focus:ring-[#7A2A3D]/15"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-blush px-5 py-3 text-xs font-bold text-charcoal uppercase tracking-wider transition hover:bg-[#7A2A3D] hover:text-white cursor-pointer border border-[#E0D7D7] hover:border-[#7A2A3D]"
                >
                  Apply
                </button>
              </form>
              {appliedDiscount && (
                <p className="text-xs text-[#3F6B4A] font-semibold flex items-center gap-1">
                  <span className="text-[#3F6B4A]">✓</span> Code <strong>{appliedDiscount.code}</strong> applied ({appliedDiscount.percent}% off)
                </p>
              )}
              {discountError && (
                <p className="text-xs text-red-600">{discountError}</p>
              )}

              {/* Price Breakdown */}
              <dl className="space-y-3 border-t border-[#E0D7D7] pt-4 text-sm text-charcoal">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-medium">Rs {subtotal.toLocaleString("en-PK", { minimumFractionDigits: 2 })}</dd>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-[#33573C]">
                    <dt>Discount</dt>
                    <dd className="font-semibold">-Rs {discountAmount.toLocaleString("en-PK", { minimumFractionDigits: 2 })}</dd>
                  </div>
                )}

                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="font-medium">
                    {isFreeShipping ? (
                      <span className="text-[#3F6B4A] font-bold">Free</span>
                    ) : (
                      `Rs ${shippingFee.toLocaleString("en-PK", { minimumFractionDigits: 2 })}`
                    )}
                  </dd>
                </div>

                <div className="flex items-baseline justify-between border-t border-[#E0D7D7] pt-4 text-base">
                  <dt className="font-semibold text-charcoal">Total</dt>
                  <dd className="font-[family-name:var(--font-heading)] text-xl font-bold text-charcoal">
                    <span className="text-xs text-muted font-normal mr-1.5">PKR</span>
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
