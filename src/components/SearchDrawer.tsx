"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice, slug, type Product } from "@/lib/data";
import { fetchDbProducts } from "@/lib/supabase";
import { mapDbProduct, allProducts } from "@/lib/catalog";

const POPULAR_SEARCHES = [
  "Padded Bra",
  "Seamless T-Shirt Bra",
  "Bra Sets",
  "Sports Bra",
  "Silk Nightwear",
  "Cotton Briefs",
  "Shapewear Suit",
  "Push-Up Bra",
];

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(allProducts);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load live products from database on mount
  useEffect(() => {
    async function loadLive() {
      try {
        const dbItems = await fetchDbProducts();
        if (dbItems && dbItems.length > 0) {
          setProducts(dbItems.map(mapDbProduct));
        }
      } catch (err) {
        console.warn("Could not load products for search:", err);
      }
    }
    loadLive();
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmedQuery = query.trim().toLowerCase();

  // Instant filter
  const results = trimmedQuery
    ? products.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(trimmedQuery);
        const catMatch = p.category?.toLowerCase().includes(trimmedQuery);
        const descMatch = p.description?.toLowerCase().includes(trimmedQuery);
        const colorMatch = p.colors?.some((c) => c.toLowerCase().includes(trimmedQuery));
        const sizeMatch = p.sizes?.some((s) => s.toLowerCase().includes(trimmedQuery));
        return nameMatch || catMatch || descMatch || colorMatch || sizeMatch;
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      />

      {/* Slide-Over Search Drawer Panel */}
      <div className="absolute inset-y-0 right-0 flex w-full max-w-full sm:max-w-lg pl-0 sm:pl-6">
        <aside
          aria-label="Search KAYFIY Store"
          className="relative flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out"
        >
          {/* Header & Search Input Box */}
          <div className="border-b border-line bg-cream/40 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#C4526E] uppercase">
                Search Products
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="rounded-full p-1.5 text-muted transition hover:bg-blush hover:text-charcoal cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted">
                <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bras, bra sets, sizes, colors..."
                className="w-full rounded-2xl border border-line bg-white pl-11 pr-10 py-3.5 text-sm text-charcoal outline-none shadow-2xs transition focus:border-[#C4526E] focus:ring-2 focus:ring-[#C4526E]/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted hover:text-charcoal cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Body Content: Results OR Trending Keywords */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {trimmedQuery.length === 0 ? (
              <div>
                {/* Trending searches */}
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                    Popular Searches
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => setQuery(keyword)}
                        className="rounded-full border border-line bg-[#FFF8FA] px-3.5 py-1.5 text-xs text-charcoal transition hover:border-[#C4526E] hover:text-[#C4526E] hover:bg-[#FCE4E8] cursor-pointer"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Collection Links */}
                <div className="mt-8">
                  <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
                    Browse Popular Collections
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    {[
                      { name: "New Arrivals", href: "/collections/new-arrivals", tag: "Fresh" },
                      { name: "Best Sellers", href: "/collections/top-selling", tag: "Top" },
                      { name: "Bras", href: "/collections/bras", tag: "30A-44DD" },
                      { name: "Bra Sets", href: "/collections/bra-sets", tag: "Matching" },
                      { name: "Nightwear", href: "/collections/nightwear", tag: "Silk & Satin" },
                      { name: "Shapewear", href: "/collections/shapewear", tag: "Contour" },
                    ].map((col) => (
                      <Link
                        key={col.name}
                        href={col.href}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-xl border border-line bg-white p-3 text-xs font-medium text-charcoal transition hover:border-[#C4526E] hover:bg-blush/40"
                      >
                        <span>{col.name}</span>
                        <span className="text-[10px] text-muted">{col.tag}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bra Size Finder Card */}
                <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#FCECEF] to-[#FFF5F7] border border-[#F2BAC5]/40 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📐</span>
                    <div>
                      <p className="text-xs font-bold text-charcoal">Need help with sizing?</p>
                      <p className="text-[11px] text-muted mt-0.5">Use our 30-second Bra Size Calculator to find your true fit.</p>
                    </div>
                  </div>
                  <Link
                    href="/pages/bra-size-calculator"
                    onClick={onClose}
                    className="mt-3 inline-block rounded-xl bg-charcoal px-4 py-2 text-[11px] font-bold tracking-wider text-white uppercase hover:bg-[#C4526E] transition"
                  >
                    Calculate My Size →
                  </Link>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blush text-[#C4526E]">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-serif text-lg font-bold text-charcoal">No products found</p>
                <p className="mt-1 text-xs text-muted">
                  No matching results for &ldquo;{query}&rdquo;. Try another search term.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-3 text-xs text-muted border-b border-line">
                  <span>Found <strong>{results.length}</strong> {results.length === 1 ? "product" : "products"}</span>
                  <span>Instant Results</span>
                </div>

                <ul className="divide-y divide-line">
                  {results.map((product) => {
                    const onSale = typeof product.compareAt === "number";
                    return (
                      <li key={product.id || product.name} className="py-3.5">
                        <Link
                          href={`/products/${slug(product.name)}`}
                          onClick={onClose}
                          className="group flex items-center gap-3.5"
                        >
                          {/* Thumbnail */}
                          <div className="relative h-18 w-14 shrink-0 overflow-hidden rounded-xl bg-blush shadow-2xs">
                            <Image
                              src={
                                product.image && (product.image.startsWith("http") || product.image.startsWith("/"))
                                  ? product.image
                                  : "/banners/hero-monsoon.jpg"
                              }
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover transition duration-300 group-hover:scale-105"
                            />
                            {onSale && (
                              <span className="absolute top-1 left-1 rounded-sm bg-[#C4526E] px-1 py-0.5 text-[8px] font-bold text-white uppercase">
                                Sale
                              </span>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-charcoal transition group-hover:text-[#C4526E] truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              {product.category || "Innerwear"}
                              {product.sizes && product.sizes.length > 0 && ` · ${product.sizes.slice(0, 3).join(", ")}`}
                            </p>
                            <div className="mt-1 flex items-baseline gap-2">
                              {onSale && (
                                <span className="text-xs text-muted line-through">
                                  {formatPrice(product.compareAt!)}
                                </span>
                              )}
                              <span className="text-sm font-bold text-charcoal">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </div>

                          {/* Arrow Indicator */}
                          <div className="text-muted group-hover:text-[#C4526E] transition">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {results.length > 0 && (
            <div className="border-t border-line bg-cream/40 p-4 text-center">
              <Link
                href={`/collections/all?q=${encodeURIComponent(trimmedQuery)}`}
                onClick={onClose}
                className="inline-block rounded-full bg-charcoal px-7 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#C4526E]"
              >
                View All Results ({results.length})
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
