"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/PageShell";

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[#7A2A3D] focus:ring-2 focus:ring-[#7A2A3D]/15 hover:border-[#D0C5C5]";

export default function AccountPage() {
  const [mode, setMode] = useState<"sign-in" | "register">("sign-in");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <PageHeader
        title="Account"
        blurb="Track orders, save addresses and keep your size on file."
        trail={[{ label: "Account" }]}
      />

      <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
        {/* Improved Toggle */}
        <div className="flex rounded-2xl bg-blush/60 border border-line p-1 gap-1">
          {(["sign-in", "register"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setMode(option);
                setSubmitted(false);
              }}
              aria-pressed={mode === option}
              className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer ${
                mode === option
                  ? "bg-[#7A2A3D] text-cream shadow-md"
                  : "text-charcoal hover:text-[#7A2A3D] hover:bg-white/50"
              }`}
            >
              {option === "sign-in" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {submitted ? (
          <div className="mt-8 rounded-2xl bg-[#FCF0F2] border border-[#EDC9D0] px-5 py-5 text-sm text-charcoal animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7A2A3D] text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold">Got it!</p>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              This storefront is a front-end preview, so accounts are not
              connected to a backend yet. Your bag still works and is saved on this
              device.
            </p>
          </div>
        ) : (
          <form
            className="mt-8 space-y-4 animate-fade-in"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            {mode === "register" && (
              <div className="animate-slide-up">
                <label htmlFor="name" className="text-xs font-medium text-muted">
                  Full name
                </label>
                <input id="name" required className={`mt-1.5 ${field}`} />
              </div>
            )}

            <div>
              <label htmlFor="account-email" className="text-xs font-medium text-muted">
                Email
              </label>
              <input
                id="account-email"
                type="email"
                required
                className={`mt-1.5 ${field}`}
              />
            </div>

            <div>
              <label htmlFor="account-password" className="text-xs font-medium text-muted">
                Password
              </label>
              <input
                id="account-password"
                type="password"
                required
                minLength={8}
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                className={`mt-1.5 ${field}`}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#7A2A3D] px-8 py-3.5 text-xs font-bold tracking-[0.16em] text-cream uppercase transition-all duration-300 hover:bg-[#5C1C2C] hover:shadow-md cursor-pointer"
            >
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          Need help with an order?{" "}
          <Link
            href="/pages/contact"
            className="text-[#7A2A3D] font-semibold underline-offset-4 hover:underline"
          >
            Contact us
          </Link>
        </p>
      </div>
    </main>
  );
}
