"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How will my order be packaged? Will anyone know what is inside?",
    a: "Your privacy is our highest priority. All Kayfiy parcels are shipped in 100% plain, sturdy brown cardboard boxes inside sealed courier flyers. There are zero product descriptions, category tags, or innerwear illustrations on the outside label.",
  },
  {
    q: "What if the size doesn't fit me? Can I exchange it?",
    a: "Yes, absolutely! We offer a 7-day hassle-free size exchange guarantee on unwashed, tagged items. Simply message our customer care on WhatsApp with your Order Number and our team will arrange an exchange for your preferred cup or band size.",
  },
  {
    q: "How long does delivery take across Pakistan?",
    a: "Orders in Karachi and Lahore typically arrive within 24 to 48 hours. For Islamabad, Rawalpindi, Faisalabad, Multan, and other cities, delivery takes 2 to 4 business days via PostEx and trusted courier partners.",
  },
  {
    q: "Do you offer Cash on Delivery (COD)?",
    a: "Yes! Cash on Delivery is available nationwide across all major cities and towns. You can pay the courier directly when your parcel is delivered to your doorstep. Orders over Rs. 3,500 qualify for completely Free Delivery!",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((current) => (current === idx ? null : idx));
  };

  return (
    <section aria-label="Frequently asked questions" className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-[#FAF0F2] px-3.5 py-1 text-[11px] font-bold tracking-[0.16em] text-[#7A2A3D] uppercase border border-[#EDC9D0]">
            Got Questions?
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-muted">
            Everything you need to know about sizing, privacy, and delivery.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#E8DCE0] transition-colors duration-200 hover:border-[#7A2A3D]/40"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between bg-white px-5 py-4 text-left transition hover:bg-[#FAF5F7] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm sm:text-base font-semibold text-charcoal pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FAF0F2] text-[#7A2A3D] transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#7A2A3D] text-white" : ""
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-[#F0E5E8] bg-[#FAF7F8]/60 px-5 py-4 text-xs sm:text-sm text-muted leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
