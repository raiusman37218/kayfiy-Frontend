"use client";

import { useState } from "react";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923053530008";
  const whatsappUrl = `https://wa.me/${waPhone}?text=Hi%20KAYFIY!%20I%20need%20help%20with%20bra%20sizing%20and%20orders.`;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Tooltip on hover/open */}
      {open && (
        <div className="mb-3 max-w-xs rounded-2xl bg-white p-4 shadow-xl border border-line text-charcoal animate-fade-up">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold text-charcoal">KAYFIY Size Expert</p>
          </div>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            Unsure about your cup or band size? Chat with us privately on WhatsApp for 100% confidential fitting advice.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-2 px-4 text-xs font-bold text-white shadow-sm hover:bg-[#1EBE5D] transition-colors"
          >
            <span>Start WhatsApp Chat</span>
          </a>
        </div>
      )}

      {/* Main floating button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Chat on WhatsApp"
          className="group flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-[#1EBE5D] cursor-pointer"
        >
          <svg className="h-6 w-6 sm:h-7 sm:w-7 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.034-.482-1.636-.68-2.673-2.348-2.753-2.458-.08-.109-.667-.889-.667-1.696 0-.806.421-1.203.571-1.364.15-.16.328-.201.438-.201.11 0 .22 0 .316.005.101.006.237-.038.371.285.144.346.49 1.199.533 1.287.043.088.072.19.014.305-.058.115-.087.188-.173.289l-.26.305c-.087.098-.178.204-.076.379.102.175.452.746.969 1.207.666.594 1.228.777 1.403.865.175.088.277.073.379-.044.102-.117.438-.511.555-.686.117-.175.234-.146.394-.088.16.058 1.018.48 1.193.568.175.088.292.131.336.204.044.073.044.423-.1 1.028z" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.66 1.446 5.175L2 22l4.982-1.306A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.697 0-3.272-.51-4.587-1.385l-.329-.219-3.056.802.816-2.98-.24-.382A8.136 8.136 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
