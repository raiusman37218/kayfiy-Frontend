"use client";

import { SortIcon } from "./Icons";

export type SortOption = "newest" | "price-asc" | "price-desc" | "popularity";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-charcoal">
      <SortIcon className="h-4 w-4 text-muted" />
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="cursor-pointer rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-charcoal outline-none transition hover:border-charcoal focus:border-[#7A2A3D]"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
