"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./useCart";
import { formatPrice, slug } from "@/lib/data";
import { fetchDbStoreSettings } from "@/lib/supabase";

// High-converting popular add-on items for cart drawer upsell
const UPSELL_ITEMS = [
  {
    slug: "seamless-cotton-everyday-panty",
    name: "Seamless Cotton Everyday Brief",
    size: "Free Size",
    price: 499,
    image: "/banners/hero-fit.jpg",
  },
  {
    slug: "silicone-bra-strap-cushions",
    name: "Soft Silicone Shoulder Strap Cushions",
    size: "Universal",
    price: 399,
    image: "/banners/hero-budget.jpg",
  },
];

export default function CartDrawer() {
  const { lines, count, subtotal, isOpen, closeCart, setQty, remove, add } = useCart();
  const [freeThreshold, setFreeThreshold] = useState(3500);
  const [noteOpen, setNoteOpen] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchDbStoreSettings();
        if (settings && typeof settings.free_delivery_threshold_pkr === "number") {
          setFreeThreshold(Number(settings.free_delivery_threshold_pkr));
        }
      } catch {
        // fallback to 3500
      }
    }
    loadSettings();
  }, []);

  // Always close drawer when entering checkout page
  useEffect(() => {
    if (pathname === "/checkout" && isOpen) {
      closeCart();
    }
  }, [pathname, isOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen && pathname !== "/checkout") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, pathname]);

  if (!isOpen || pathname === "/checkout") return null;

  const isFreeShipping = subtotal >= freeThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  // Filter upsells that aren't already in the cart
  const availableUpsells = UPSELL_ITEMS.filter(
    (u) => !lines.some((l) => l.slug === u.slug)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dark backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
      />

      {/* Slide-Over Drawer (Shopify Style) */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-6">
        <aside
          aria-label="Shopping Cart Drawer"
          className="relative flex w-screen max-w-md flex-col bg-white shadow-2xl animate-slide-in-right"
        >
          {/* 1. Shopify Header */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-white">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold tracking-tight text-charcoal">
                Your Cart
              </h2>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7A2A3D] px-1.5 text-[11px] font-bold text-white shadow-2xs">
                {count}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart"
              className="rounded-full p-1.5 text-muted hover:bg-blush hover:text-charcoal transition cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 2. Free Delivery Progress Bar (Shopify Standard) */}
          <div
            className={`border-b px-5 py-3 transition-colors duration-300 ${
              isFreeShipping
                ? "border-[#CFE0D2] bg-[#EEF4EE]"
                : "border-line bg-[#FCF0F2]"
            }`}
          >
            <div className="flex items-center justify-between gap-3 text-xs">
              {isFreeShipping ? (
                <p className="flex items-center gap-1.5 font-bold text-[#33573C]">
                  <span className="text-sm">🎉</span>
                  <span>You&apos;ve unlocked <strong>FREE Delivery</strong>!</span>
                </p>
              ) : (
                <>
                  <p className="text-charcoal text-xs">
                    Add{" "}
                    <strong className="font-bold text-[#7A2A3D]">
                      {formatPrice(remainingForFree)}
                    </strong>{" "}
                    more for <strong>FREE Delivery</strong>
                  </p>
                  <span className="shrink-0 text-[11px] font-bold text-muted">
                    {progressPercent}%
                  </span>
                </>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isFreeShipping ? "bg-[#3F6B4A]" : "bg-[#7A2A3D]"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12 animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush text-[#7A2A3D]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold text-charcoal">Your cart is empty</h3>
                <p className="mt-1.5 text-xs text-muted max-w-[240px] leading-relaxed">
                  Discover pure comfort wear, breathable everyday bras and coordinates.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 rounded-full bg-[#7A2A3D] px-8 py-3.5 text-xs font-bold tracking-wider text-white uppercase transition-all duration-300 hover:bg-[#5C1C2C] hover:shadow-md cursor-pointer active:scale-95"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {lines.map((line) => (
                  <li key={`${line.slug}-${line.size}`} className="flex gap-3.5 py-4 first:pt-1">
                    {/* Square Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-[#F8F6F4]">
                      <Image
                        src={
                          line.image && (line.image.startsWith("http") || line.image.startsWith("/"))
                            ? line.image
                            : "/banners/hero-monsoon.jpg"
                        }
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/products/${line.slug}`}
                            onClick={closeCart}
                            className="font-semibold text-xs sm:text-sm text-charcoal hover:text-[#7A2A3D] line-clamp-1 transition"
                          >
                            {line.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(line.slug, line.size)}
                            aria-label={`Remove ${line.name}`}
                            className="text-muted-soft hover:text-[#E50000] transition p-1 cursor-pointer"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">
                          Size: <span className="font-semibold text-charcoal">{line.size}</span>
                        </p>
                      </div>

                      {/* Quantity Pill + Bold Price */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-line bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                            aria-label="Decrease quantity"
                            className="px-2.5 py-1 text-xs text-muted hover:text-[#7A2A3D] font-bold transition cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-charcoal">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                            aria-label="Increase quantity"
                            className="px-2.5 py-1 text-xs text-muted hover:text-[#7A2A3D] font-bold transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-bold text-charcoal">
                          {formatPrice(line.price * line.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* 4. Frequently Bought Together / Upsell (Shopify Feature) */}
            {lines.length > 0 && availableUpsells.length > 0 && (
              <div className="rounded-2xl border border-line bg-[#FAF7F5] p-3.5 space-y-2.5 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Frequently Bought Together
                  </span>
                  <span className="text-[10px] font-semibold text-[#7A2A3D]">Popular Add-on</span>
                </div>
                {availableUpsells.slice(0, 1).map((item) => (
                  <div key={item.slug} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-line/60">
                    <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-blush">
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-charcoal truncate">{item.name}</p>
                      <p className="text-[11px] font-bold text-[#7A2A3D]">{formatPrice(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => add({ slug: item.slug, name: item.name, price: item.price, image: item.image, size: item.size }, 1, false)}
                      className="shrink-0 rounded-lg bg-blush px-3 py-1.5 text-xs font-bold text-[#7A2A3D] hover:bg-[#7A2A3D] hover:text-white transition cursor-pointer active:scale-95"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Collapsible Order Note (Shopify Standard) */}
            {lines.length > 0 && (
              <div className="border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => setNoteOpen(!noteOpen)}
                  className="flex w-full items-center justify-between text-xs font-medium text-muted hover:text-charcoal py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.86 4.49l2.65 2.65m-1.4-3.9a1.87 1.87 0 012.65 2.65L7.5 19.15l-3.5.85.85-3.5L18.11 3.24z" />
                    </svg>
                    <span>{noteOpen ? "Hide order note" : "+ Add delivery note or instructions"}</span>
                  </span>
                  <span className="text-muted-soft text-sm">{noteOpen ? "−" : "+"}</span>
                </button>
                {noteOpen && (
                  <textarea
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Nearby landmark, gate instructions, or preferred delivery timing..."
                    className="mt-2 w-full rounded-xl border border-line p-2.5 text-xs text-charcoal outline-none focus:border-[#7A2A3D]"
                  />
                )}
              </div>
            )}
          </div>

          {/* 6. Sticky High-Converting Shopify Footer */}
          {lines.length > 0 && (
            <div className="border-t border-line bg-[#FAF7F5] p-4 sm:p-5 shadow-lg">
              {/* Discreet Guarantee */}
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-white border border-line/80 px-3 py-2 text-[11px] text-charcoal">
                <svg className="h-4 w-4 shrink-0 text-[#7A2A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 21h10.5a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 12.75v6A2.25 2.25 0 006.75 21z" />
                </svg>
                <span><strong>100% Discreet Packaging:</strong> Plain box with zero labels outside.</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm text-charcoal">
                <span className="text-muted font-medium">Estimated Subtotal</span>
                <span className="text-lg font-extrabold text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted">
                Taxes and shipping calculated at checkout.
              </p>

              {/* Big Shopify Checkout Button */}
              <div className="mt-3.5 space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="group flex w-full items-center justify-between rounded-xl bg-[#7A2A3D] px-5 py-3.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all duration-300 hover:bg-[#5C1C2C] hover:shadow-lg active:scale-98 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    CHECK OUT
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </Link>

                <div className="flex justify-between items-center px-1 pt-1 text-[11px] text-muted">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="text-[#3F6B4A] font-bold">✓</span> COD Available
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <span className="text-[#3F6B4A] font-bold">✓</span> 7-Day Exchange
                  </span>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="underline text-charcoal font-semibold hover:text-[#7A2A3D]"
                  >
                    View Bag
                  </Link>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
