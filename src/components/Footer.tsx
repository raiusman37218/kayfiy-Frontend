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

  const topCategories = categories.slice(0, 6);
  const helpLinks = usefulLinks.slice(0, 6);

  return (
    <footer className="border-t border-line bg-cream font-sans">
      {/* 1. Compact Trust Strip */}
      <div className="border-b border-line/60 bg-[#FDF0F3]/60 py-3 px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center text-[11px] sm:text-xs text-charcoal font-medium">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm">🚚</span>
            <span>Free Delivery Over Rs. 3,500</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm">🔒</span>
            <span>100% Discreet Packaging</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm">🔄</span>
            <span>7-Day Size Exchange</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm">💵</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* 2. Main Organized Compact Grid */}
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
          {/* Brand Info (Col 1-4) */}
          <div className="md:col-span-4 space-y-2.5">
            <Link href="/" className="inline-block" aria-label="KAYFIY Home">
              <KayfiyLogo size="sm" />
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              Everyday comfort wear for women — honest sizing, breathable fabrics, and soft support.
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              <Link
                href="https://instagram.com"
                aria-label="KAYFIY on Instagram"
                className="rounded-full border border-line p-1.5 text-charcoal transition hover:border-[#C4526E] hover:text-[#C4526E] hover:bg-blush"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="https://facebook.com"
                aria-label="KAYFIY on Facebook"
                className="rounded-full border border-line p-1.5 text-charcoal transition hover:border-[#C4526E] hover:text-[#C4526E] hover:bg-blush"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Links (2-Column Grid on Mobile for compact height) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {/* Shop Column */}
            <div>
              <h3 className="font-serif text-xs font-bold text-charcoal tracking-wider uppercase">
                Shop
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {topCategories.map((item) => (
                  <li key={item.href || item.label}>
                    <Link
                      href={item.href}
                      className="text-xs text-muted transition hover:text-[#C4526E]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help / Information Column */}
            <div>
              <h3 className="font-serif text-xs font-bold text-charcoal tracking-wider uppercase">
                Customer Care
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {helpLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs text-muted transition hover:text-[#C4526E]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter / Contact (Col 10-12) */}
          <div className="md:col-span-3 space-y-2.5">
            <h3 className="font-serif text-xs font-bold text-charcoal tracking-wider uppercase">
              Stay in Touch
            </h3>
            <p className="text-xs text-muted">
              Fit tips, restock alerts & new launches.
            </p>
            <form
              className="flex items-center rounded-full border border-line bg-white p-1 focus-within:border-[#C4526E] focus-within:ring-1 focus-within:ring-[#C4526E]/20"
              onSubmit={(event) => {
                event.preventDefault();
                setSignedUp(true);
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full bg-transparent px-2.5 py-1 text-xs text-charcoal outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="rounded-full bg-[#C4526E] px-3.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider transition hover:bg-[#A83853] shrink-0 cursor-pointer"
              >
                Join
              </button>
            </form>
            {signedUp && (
              <p className="text-[11px] text-[#C4526E] font-medium">
                ✓ Check your inbox to confirm!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Minimal Legal Bar */}
      <div className="border-t border-line/70 py-3 px-4 bg-white/40">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-muted">
          <p>© {new Date().getFullYear()} KAYFIY. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/pages/shipping-and-return" className="hover:text-charcoal transition">Shipping & Returns</Link>
            <span>•</span>
            <Link href="/pages/contact" className="hover:text-charcoal transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
