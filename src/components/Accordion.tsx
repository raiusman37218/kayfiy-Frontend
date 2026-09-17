"use client";

import { useState } from "react";
import { ChevronIcon } from "./Icons";

export type AccordionItem = {
  title: string;
  rows: [term: string, detail: string][];
};

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-8 divide-y divide-line border-t border-b border-line">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-black cursor-pointer"
            >
              {item.title}
              <ChevronIcon
                className={`h-4 w-4 shrink-0 text-muted transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <dl className="animate-fade-in space-y-3 pb-4 text-sm">
                {item.rows.map(([term, detail]) => (
                  <div key={term} className="flex gap-6">
                    <dt className="w-24 shrink-0 font-medium text-black/70">
                      {term}
                    </dt>
                    <dd className="text-black/80">{detail}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        );
      })}
    </div>
  );
}
