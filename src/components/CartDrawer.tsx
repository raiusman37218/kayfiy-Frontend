"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./useCart";
import { formatPrice, slug } from "@/lib/data";
import { fetchDbStoreSettings } from "@/lib/supabase";

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dark backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Slide-Over Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-6">
        <aside
          aria-label="Shopping Cart Drawer"
          className="relative flex w-screen max-w-md flex-col bg-white shadow-2xl animate-slide-in-right"
        >
          {/* 1. Header (Shopify standard) */}
          <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-white">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-charcoal">
                Shopping Bag
              </h2>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7A2A3D] px-1.5 text-[11px] font-bold text-white">
                {count}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart"
              className="rounded-full p-1.5 text-muted-soft hover:bg-blush hover:text-charcoal transition cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 2. Free delivery progress — same wording as the bag page */}
          <div
            className={`border-b px-5 py-3 ${
              isFreeShipping
                ? "border-[#CFE0D2] bg-[#EEF4EE]"
                : "border-line bg-[#FCF0F2]"
            }`}
          >
            <div className="flex items-center justify-between gap-3 text-xs">
              {isFreeShipping ? (
                <p className="flex items-center gap-1.5 font-semibold text-[#33573C]">
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
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
                  <p className="text-charcoal">
                    Add{" "}
                    <span className="font-semibold text-maroon">
                      {formatPrice(remainingForFree)}
                    </span>{" "}
                    more for free nationwide delivery
                  </p>
                  <span className="shrink-0 text-[11px] font-bold text-muted">
                    {progressPercent}%
                  </span>
                </>
              )}
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFreeShipping ? "bg-[#3F6B4A]" : "bg-maroon"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12 animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush text-[#7A2A3D] animate-float">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold text-charcoal">Your bag is empty</h3>
                <p className="mt-1.5 text-xs text-muted max-w-[220px] leading-relaxed">
                  Explore our comfortable everyday innerwear collection.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 rounded-full bg-[#7A2A3D] px-7 py-3.5 text-xs font-bold tracking-wider text-white uppercase transition-all duration-300 hover:bg-[#5C1C2C] hover:shadow-md cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {lines.map((line) => (
                  <li key={`${line.slug}-${line.size}`} className="flex gap-3.5 py-4">
                    {/* Thumbnail */}
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-blush">
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
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/products/${line.slug}`}
                            onClick={closeCart}
                            className="font-medium text-sm text-charcoal hover:text-[#7A2A3D] line-clamp-1 transition"
                          >
                            {line.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(line.slug, line.size)}
                            aria-label={`Remove ${line.name}`}
                            className="text-muted-soft hover:text-maroon transition p-0.5 cursor-pointer"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">
                          Size: <span className="font-medium text-charcoal">{line.size}</span>
                        </p>
                      </div>

                      {/* Quantity Pill + Price */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-line bg-white">
                          <button
                            type="button"
                            onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                            className="px-2.5 py-1 text-xs text-muted hover:text-[#7A2A3D] transition cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-charcoal">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                            className="px-2.5 py-1 text-xs text-muted hover:text-[#7A2A3D] transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-charcoal">
                          {formatPrice(line.price * line.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* 4. Collapsible Order Note (Shopify standard) */}
            {lines.length > 0 && (
              <div className="border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => setNoteOpen(!noteOpen)}
                  className="flex w-full items-center justify-between text-xs font-medium text-muted hover:text-charcoal py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.86 4.49l2.65 2.65m-1.4-3.9a1.87 1.87 0 012.65 2.65L7.5 19.15l-3.5.85.85-3.5L18.11 3.24z" />
                    </svg>
                    <span>{noteOpen ? "Hide delivery instructions" : "+ Add delivery note or instructions"}</span>
                  </span>
                  <span className="text-muted-soft">{noteOpen ? "−" : "+"}</span>
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

          {/* 5. Sticky Shopify Footer & Checkout Button */}
          {lines.length > 0 && (
            <div className="border-t border-line bg-[#FBF9F7] p-5">
              {/* Discreet Guarantee */}
              <div className="mb-3.5 flex items-center gap-2 rounded-xl bg-white border border-line p-2.5 text-[11px] text-charcoal">
                <svg className="h-4 w-4 shrink-0 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 21h10.5a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 12.75v6A2.25 2.25 0 006.75 21z" />
                </svg>
                <span><strong>100% Discreet Packaging:</strong> Plain delivery box with no contents or logo listed outside.</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm text-charcoal">
                <span className="text-muted font-medium">Subtotal</span>
                <span className="font-serif text-lg font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted">
                Taxes and shipping calculated at checkout.
              </p>

              {/* High-Converting Shopify Checkout Button */}
              <div className="mt-4 space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="group flex w-full items-center justify-between rounded-2xl bg-[#7A2A3D] px-6 py-4 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all duration-300 hover:bg-[#5C1C2C] hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    CHECK OUT
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </Link>

                <div className="flex justify-between items-center px-1 pt-1.5 text-[11px] text-muted">
                  <span className="flex items-center gap-1">✓ Cash on Delivery</span>
                  <span className="flex items-center gap-1">✓ 7-Day Size Exchange</span>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="underline text-charcoal hover:text-[#7A2A3D]"
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
