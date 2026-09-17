"use client";

import { useMemo, useState } from "react";
import ProductGrid from "./ProductGrid";
import FilterSidebar, { type Filters } from "./FilterSidebar";
import SortDropdown, { type SortOption } from "./SortDropdown";
import { sizesFor } from "@/lib/sizes";
import type { Product } from "@/lib/data";

const PAGE_SIZE = 24;

export default function CollectionControls({ products }: { products: Product[] }) {
  const priceCeiling = useMemo(
    () => products.reduce((max, p) => Math.max(max, p.price), 0),
    [products],
  );

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => sizesFor(p).forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [products]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) =>
      (p.colors || []).forEach((c) => {
        if (c && c.toLowerCase() !== "default") set.add(c);
      }),
    );
    return Array.from(set).sort();
  }, [products]);

  const availableFabrics = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.fabric) set.add(p.fabric);
    });
    return Array.from(set).sort();
  }, [products]);

  const [filters, setFilters] = useState<Filters>({
    sizes: [],
    colors: [],
    fabrics: [],
    maxPrice: priceCeiling,
  });
  const [sort, setSort] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.sizes.length > 0) {
        const productSizes = sizesFor(p);
        if (!filters.sizes.some((s) => productSizes.includes(s))) return false;
      }
      if (filters.colors.length > 0) {
        const productColors = p.colors || [];
        if (!filters.colors.some((c) => productColors.includes(c))) return false;
      }
      if (filters.fabrics.length > 0) {
        if (!p.fabric || !filters.fabrics.includes(p.fabric)) return false;
      }
      if (p.price > filters.maxPrice) return false;
      return true;
    });
  }, [products, filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "popularity")
      list.sort((a, b) => Number(b.bestsellere) - Number(a.bestsellere));
    // "newest" keeps the incoming order (DB products already arrive newest-first).
    return list;
  }, [filtered, sort]);

  const visible = sorted.slice(0, visibleCount);
  const hasFilterOptions =
    availableSizes.length > 0 || availableColors.length > 0 || availableFabrics.length > 0;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {hasFilterOptions && (
        <FilterSidebar
          className="shrink-0 lg:w-56"
          availableSizes={availableSizes}
          availableColors={availableColors}
          availableFabrics={availableFabrics}
          priceCeiling={priceCeiling}
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setVisibleCount(PAGE_SIZE);
          }}
        />
      )}

      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">
            {sorted.length} {sorted.length === 1 ? "product" : "products"}
          </p>
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        <ProductGrid products={visible} />

        {visibleCount < sorted.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="rounded-full border border-charcoal px-8 py-3 text-xs font-bold tracking-[0.16em] text-charcoal uppercase transition hover:bg-charcoal hover:text-white cursor-pointer"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
