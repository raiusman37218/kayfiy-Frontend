import React from "react";

const REVIEWS = [
  {
    name: "Ayesha Khan",
    city: "Karachi",
    rating: 5,
    tag: "Verified Buyer",
    title: "Finally found bras that don't dig in!",
    comment:
      "I ordered 2 padded bras and 1 cotton non-padded. The sizing calculator was shockingly accurate. The fabric is so breathable for Karachi weather and the packaging was completely discreet in a plain brown box.",
    purchased: "Everyday Padded & Cotton Bras",
  },
  {
    name: "Zainab Malik",
    city: "Lahore",
    rating: 5,
    tag: "Verified Buyer",
    title: "The Pj Sets feel like absolute luxury",
    comment:
      "The satin pj set arrived in 3 days. The stitching and silk texture feel like international luxury brands but at half the price. Super comfortable for lounging and sleeping.",
    purchased: "Sahar Silk Nightwear Set",
  },
  {
    name: "Fatima Tariq",
    city: "Islamabad",
    rating: 5,
    tag: "Verified Buyer",
    title: "Flawless size exchange experience",
    comment:
      "I accidentally ordered a 34C instead of 36B. The WhatsApp support helped me exchange the size within 48 hours without any questions asked. 10/10 customer care!",
    purchased: "Full Coverage Wired Bra",
  },
];

export default function TestimonialsSection() {
  return (
    <section aria-label="Customer reviews" className="bg-[#FAF2F4]/60 py-16 sm:py-20 border-y border-[#EDC9D0]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block rounded-full bg-white px-3.5 py-1 text-[11px] font-bold tracking-[0.16em] text-[#7A2A3D] uppercase border border-[#EDC9D0]">
            Customer Love
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal tracking-tight">
            Loved by Over 40,000+ Pakistani Women
          </h2>
          <p className="mt-2 text-sm text-muted">
            Real feedback from women who found honest sizing, comfort, and uncompromising privacy with Kayfiy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-[#EDC9D0]/80 bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <h3 className="font-serif text-base font-bold text-charcoal leading-snug">
                  &ldquo;{review.title}&rdquo;
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-muted leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#EDC9D0]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF0F2] border border-[#EDC9D0] text-[#7A2A3D] font-serif font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-charcoal">{review.name}</p>
                    <p className="text-[10px] text-muted">{review.city}, Pakistan</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF5EE] px-2.5 py-0.5 text-[10px] font-semibold text-[#285A34]">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {review.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
