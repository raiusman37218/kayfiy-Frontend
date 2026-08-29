"use client";

import Link from "next/link";
import { useState } from "react";
import { footerCategories, usefulLinks } from "@/lib/data";
import { FacebookIcon, InstagramIcon } from "./Icons";

export default function Footer() {
  const [signedUp, setSignedUp] = useState(false);

  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <p className="font-serif text-3xl tracking-[0.22em] text-charcoal uppercase">
            Lisset
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Lisset makes everyday innerwear for Pakistani women — honest sizing,
            breathable fabrics and quiet support you forget you are wearing.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href="https://facebook.com"
              aria-label="Lisset on Facebook"
              className="rounded-full border border-line p-2.5 text-charcoal transition hover:border-rose hover:text-rose"
            >
              <FacebookIcon className="h-4 w-4" />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Lisset on Instagram"
              className="rounded-full border border-line p-2.5 text-charcoal transition hover:border-rose hover:text-rose"
            >
              <InstagramIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg text-charcoal">Shop By Category</h2>
          <ul className="mt-4 space-y-2">
            {footerCategories.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition hover:text-rose"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg text-charcoal">Useful Links</h2>
          <ul className="mt-4 space-y-2">
            {usefulLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition hover:text-rose"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg text-charcoal">Stay in Touch</h2>
          <p className="mt-4 text-sm text-muted">
            Fit tips, restock alerts and first access to every Lisset sale.
          </p>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setSignedUp(true);
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-rose"
            />
            <button
              type="submit"
              className="rounded-full bg-rose px-6 py-2.5 text-xs tracking-[0.16em] text-white uppercase transition hover:bg-rose-dark"
            >
              Sign up
            </button>
          </form>
          {signedUp && (
            <p className="mt-2 text-xs text-rose">
              Thank you — check your inbox to confirm.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} Lisset. All rights reserved.</p>
          <p>Designed and delivered across Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
