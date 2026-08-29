"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatPrice, slug, type Product } from "@/lib/data";
import { fetchDbProducts } from "@/lib/supabase";
import { mapDbProduct, allProducts } from "@/lib/catalog";
import { SearchIcon } from "./Icons";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>(allProducts);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load live products from database on mount
  useEffect(() => {
    async function loadLive() {
      try {
        const dbItems = await fetchDbProducts();
        if (dbItems && dbItems.length > 0) {
          setProducts(dbItems.map(mapDbProduct));
        }
      } catch (err) {
        console.warn("Could not load products for header search:", err);
      }
    }
    loadLive();
  }, []);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsFocused(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const trimmedQuery = query.trim().toLowerCase();

  const results = trimmedQuery
    ? products.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(trimmedQuery);
        const catMatch = p.category?.toLowerCase().includes(trimmedQuery);
        const colorMatch = p.colors?.some((c) =>
          c.toLowerCase().includes(trimmedQuery),
        );
        const sizeMatch = p.sizes?.some((s) =>
          s.toLowerCase().includes(trimmedQuery),
        );
        return nameMatch || catMatch || colorMatch || sizeMatch;
      })
    : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedQuery) return;
    setIsFocused(false);
    router.push(`/collections/all?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const showDropdown = isFocused && trimmedQuery.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center rounded-full border border-[#E0D7D7] bg-white px-3 py-1.5 transition-all duration-200 focus-within:border-[#C4526E] focus-within:ring-2 focus-within:ring-[#C4526E]/15 w-36 sm:w-44 md:w-52 lg:w-56 shadow-2xs hover:border-[#D0C5C5]"
      >
        <SearchIcon className="h-3.5 w-3.5 text-gray-500 shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="I'm looking for..."
          className="w-full bg-transparent pl-2 pr-1 text-xs sm:text-sm text-charcoal outline-none placeholder:text-gray-400 placeholder:font-light"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-gray-400 hover:text-charcoal cursor-pointer p-0.5"
            aria-label="Clear search"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </form>

      {/* Floating Live Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 top-full mt-2 w-72 sm:w-84 md:w-96 rounded-2xl bg-white shadow-2xl border border-line p-3 z-50 max-h-[420px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted">
              <p className="font-semibold text-charcoal">No products found</p>
              <p className="mt-1">Try searching for &ldquo;bra&rdquo;, &ldquo;set&rdquo;, &ldquo;silk&rdquo;...</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between pb-2 px-1 text-[11px] font-semibold tracking-wider text-muted uppercase border-b border-line">
                <span>Products ({results.length})</span>
                <span className="text-[#C4526E]">Quick View</span>
              </div>

              <ul className="divide-y divide-line/60">
                {results.slice(0, 6).map((product) => {
                  const onSale = typeof product.compareAt === "number";
                  return (
                    <li key={product.id || product.name}>
                      <Link
                        href={`/products/${slug(product.name)}`}
                        onClick={() => {
                          setIsFocused(false);
                          setQuery("");
                        }}
                        className="group flex items-center gap-3 p-2 rounded-xl transition hover:bg-blush/40"
                      >
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-blush shadow-2xs">
                          <Image
                            src={
                              product.image &&
                              (product.image.startsWith("http") ||
                                product.image.startsWith("/"))
                                ? product.image
                                : "/banners/hero-monsoon.jpg"
                            }
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-charcoal group-hover:text-[#C4526E] truncate transition">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-muted truncate">
                            {product.category || "Innerwear"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-bold text-charcoal">
                            {formatPrice(product.price)}
                          </p>
                          {onSale && (
                            <span className="text-[10px] text-rose font-medium">
                              Sale
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {results.length > 6 && (
                <div className="pt-2 border-t border-line text-center">
                  <Link
                    href={`/collections/all?q=${encodeURIComponent(trimmedQuery)}`}
                    onClick={() => setIsFocused(false)}
                    className="text-xs font-semibold text-[#C4526E] hover:underline"
                  >
                    View all {results.length} results →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
