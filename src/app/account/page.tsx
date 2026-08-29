"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/PageShell";

const field =
  "w-full rounded-2xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-rose";

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
        <div className="flex rounded-full border border-line p-1">
          {(["sign-in", "register"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setMode(option);
                setSubmitted(false);
              }}
              aria-pressed={mode === option}
              className={`flex-1 rounded-full px-4 py-2 text-xs tracking-[0.14em] uppercase transition ${
                mode === option
                  ? "bg-charcoal text-cream"
                  : "text-charcoal hover:text-rose"
              }`}
            >
              {option === "sign-in" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {submitted ? (
          <p className="mt-8 rounded-2xl bg-blush px-5 py-4 text-sm text-charcoal">
            Thanks — this storefront is a front-end preview, so accounts are not
            connected to a backend yet. Your bag still works and is saved on this
            device.
          </p>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="text-xs text-muted">
                  Full name
                </label>
                <input id="name" required className={`mt-1 ${field}`} />
              </div>
            )}

            <div>
              <label htmlFor="account-email" className="text-xs text-muted">
                Email
              </label>
              <input
                id="account-email"
                type="email"
                required
                className={`mt-1 ${field}`}
              />
            </div>

            <div>
              <label htmlFor="account-password" className="text-xs text-muted">
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
                className={`mt-1 ${field}`}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-charcoal px-8 py-3.5 text-xs tracking-[0.16em] text-cream uppercase transition hover:bg-rose"
            >
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          Need help with an order?{" "}
          <Link
            href="/pages/contact"
            className="text-rose underline-offset-4 hover:underline"
          >
            Contact us
          </Link>
        </p>
      </div>
    </main>
  );
}
