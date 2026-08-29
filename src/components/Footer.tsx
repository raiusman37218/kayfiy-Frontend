"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import KayfiyLogo from "./KayfiyLogo";
import { footerCategories as defaultFooterCategories, usefulLinks, type NavLink } from "@/lib/data";
import { fetchDbCategories } from "@/lib/supabase";
import { FacebookIcon, InstagramIcon } from "./Icons";

export default function Footer() {
  const [categories, setCategories] = useState<NavLink[]>(defaultFooterCategories);
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchDbCategories();
      if (cats && cats.length > 0) {
        const topLevel = cats.filter((c) => !c.parent_slug);
        const seen = new Set<string>();
        const unique = topLevel.filter((c) => {
          if (seen.has(c.slug)) return false;
          seen.add(c.slug);
          return true;
        });

        setCategories(
          unique.map((c) => ({
            label: c.name,
            href: `/collections/${c.slug}`,
          })),
        );
      }
    }
    loadCategories();
  }, []);

  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div>
          <Link href="/" className="inline-block" aria-label="KAYFIY Home">
            <KayfiyLogo size="md" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            KAYFIY makes everyday comfort wear for women — honest sizing,
            breathable fabrics and soothing support you forget you are wearing.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href="https://facebook.com"
              aria-label="KAYFIY on Facebook"
              className="rounded-full border border-line p-2.5 text-charcoal transition hover:border-rose hover:text-rose hover:bg-blush"
            >
              <FacebookIcon className="h-4 w-4" />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="KAYFIY on Instagram"
              className="rounded-full border border-line p-2.5 text-charcoal transition hover:border-rose hover:text-rose hover:bg-blush"
            >
              <InstagramIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg text-charcoal font-semibold">Shop By Category</h2>
          <ul className="mt-4 space-y-2">
            {categories.map((item) => (
              <li key={item.href || item.label}>
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
          <h2 className="font-serif text-lg text-charcoal font-semibold">Useful Links</h2>
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
          <h2 className="font-serif text-lg text-charcoal font-semibold">Stay in Touch</h2>
          <p className="mt-4 text-sm text-muted">
            Fit tips, restock alerts and first access to every KAYFIY new launch.
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
              className="rounded-full bg-rose px-6 py-2.5 text-xs tracking-[0.16em] text-white uppercase transition hover:bg-rose-dark cursor-pointer"
            >
              Sign up
            </button>
          </form>
          {signedUp && (
            <p className="mt-2 text-xs text-rose font-medium">
              Thank you — check your inbox to confirm.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} KAYFIY. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Delivered across Pakistan with discreet packaging <span className="text-rose">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
