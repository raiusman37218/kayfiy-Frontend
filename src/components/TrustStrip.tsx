import React from "react";

export default function TrustStrip() {
  const pillars = [
    {
      icon: (
        <svg className="h-6 w-6 text-[#7A2A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 8-8m-4-5V3a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1h3" />
        </svg>
      ),
      badge: "Free Delivery",
      title: "Orders Over Rs. 3,500",
      desc: "Delivered to your doorstep anywhere across Pakistan in 2-4 business days.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-[#7A2A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      badge: "100% Discreet",
      title: "Private Brown-Box Packaging",
      desc: "Plain, secure packaging with zero product descriptions or innerwear labels outside.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-[#7A2A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      badge: "Guaranteed Fit",
      title: "7-Day Size Exchange",
      desc: "Wrong size? Swap for the correct cup or band size smoothly with our support team.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-[#7A2A3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: "Easy Payment",
      title: "Cash on Delivery",
      desc: "Pay in cash at your doorstep upon receiving your parcel in all major cities.",
    },
  ];

  return (
    <section aria-label="Customer trust guarantees" className="border-b border-[#EDC9D0]/50 bg-gradient-to-b from-[#FAF1F3] via-white to-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#EED7DC] bg-white/90 p-5 shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#7A2A3D]/40 hover:shadow-md"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FAF0F2] border border-[#EED7DC] transition-transform duration-300 group-hover:scale-108 group-hover:bg-[#7A2A3D] group-hover:text-white">
                  {React.cloneElement(item.icon, {
                    className: "h-5 w-5 text-[#7A2A3D] group-hover:text-white transition-colors duration-300",
                  })}
                </div>
                <div>
                  <span className="inline-block rounded-full bg-[#FAF0F2] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#7A2A3D] uppercase">
                    {item.badge}
                  </span>
                  <h3 className="mt-1 font-serif text-sm font-bold text-charcoal leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
