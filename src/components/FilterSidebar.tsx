"use client";

import { FilterIcon } from "./Icons";

export type Filters = {
  sizes: string[];
  colors: string[];
  fabrics: string[];
  maxPrice: number;
};

type FilterSidebarProps = {
  availableSizes: string[];
  availableColors: string[];
  availableFabrics: string[];
  priceCeiling: number;
  filters: Filters;
  onChange: (filters: Filters) => void;
  className?: string;
};

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function FilterSidebar({
  availableSizes,
  availableColors,
  availableFabrics,
  priceCeiling,
  filters,
  onChange,
  className = "",
}: FilterSidebarProps) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-charcoal uppercase">
        <FilterIcon className="h-4 w-4" />
        Filter
      </div>

      {availableSizes.length > 0 && (
        <fieldset className="border-t border-line py-4">
          <legend className="mb-3 text-xs font-bold tracking-wider text-charcoal uppercase">
            Size
          </legend>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const active = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, sizes: toggleValue(filters.sizes, size) })
                  }
                  aria-pressed={active}
                  className={`min-w-11 rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    active
                      ? "border-[#7A2A3D] bg-[#7A2A3D] text-white"
                      : "border-line bg-white text-charcoal hover:border-charcoal"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {availableColors.length > 0 && (
        <fieldset className="border-t border-line py-4">
          <legend className="mb-3 text-xs font-bold tracking-wider text-charcoal uppercase">
            Color
          </legend>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const active = filters.colors.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, colors: toggleValue(filters.colors, color) })
                  }
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition cursor-pointer ${
                    active
                      ? "border-[#7A2A3D] bg-[#7A2A3D] text-white"
                      : "border-line bg-white text-charcoal hover:border-charcoal"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {availableFabrics.length > 0 && (
        <fieldset className="border-t border-line py-4">
          <legend className="mb-3 text-xs font-bold tracking-wider text-charcoal uppercase">
            Fabric
          </legend>
          <div className="flex flex-wrap gap-2">
            {availableFabrics.map((fabric) => {
              const active = filters.fabrics.includes(fabric);
              return (
                <button
                  key={fabric}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, fabrics: toggleValue(filters.fabrics, fabric) })
                  }
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition cursor-pointer ${
                    active
                      ? "border-[#7A2A3D] bg-[#7A2A3D] text-white"
                      : "border-line bg-white text-charcoal hover:border-charcoal"
                  }`}
                >
                  {fabric}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {priceCeiling > 0 && (
        <fieldset className="border-t border-line border-b py-4">
          <legend className="mb-3 flex w-full items-center justify-between text-xs font-bold tracking-wider text-charcoal uppercase">
            <span>Price</span>
            <span className="font-normal normal-case text-muted">
              Up to Rs. {filters.maxPrice.toLocaleString("en-PK")}
            </span>
          </legend>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={Math.max(50, Math.round(priceCeiling / 50))}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-[#7A2A3D]"
          />
        </fieldset>
      )}

      <button
        type="button"
        onClick={() =>
          onChange({ sizes: [], colors: [], fabrics: [], maxPrice: priceCeiling })
        }
        className="mt-4 text-xs font-semibold text-[#7A2A3D] underline-offset-4 hover:underline cursor-pointer"
      >
        Clear filters
      </button>
    </div>
  );
}
