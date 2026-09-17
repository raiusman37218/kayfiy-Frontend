"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import KayfiyLogo from "./KayfiyLogo";
import NewsletterForm from "./NewsletterForm";
import { footerCategories as defaultFooterCategories, usefulLinks, type NavLink } from "@/lib/data";
import { fetchDbCategories } from "@/lib/supabase";
import { FacebookIcon, InstagramIcon } from "./Icons";
import {
  FastTruckIcon,
  DiscreetPackageIcon,
  ExchangeBoxIcon,
  SecureCoinsIcon,
} from "./ProductTrustBadges";

function WhatsAppIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TikTokIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 007.04 6.3 6.34 6.34 0 005.15-6.22V8.73a8.19 8.19 0 004.25 1.18V6.69z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<NavLink[]>(defaultFooterCategories);

  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchDbCategories();
      if (cats && cats.length > 0) {
        const topLevel = cats
          .filter((c) => !c.parent_slug && c.show_in_footer !== false)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        const seen = new Set<string>();
        const unique = topLevel.filter((c) => {
          if (seen.has(c.slug)) return false;
          seen.add(c.slug);
          return true;
        });

        if (unique.length > 0) {
          setCategories(
            unique.map((c) => ({
              label: c.name,
              href: `/collections/${c.slug}`,
            })),
          );
        }
      }
    }
    loadCategories();
  }, []);

  if (pathname === "/checkout") return null;

  const topCategories = categories.slice(0, 6);
  const helpLinks = usefulLinks.slice(0, 6);

  return (
    <footer className="border-t border-line bg-cream font-sans">
      {/* 1. Compact Illustrated Trust Strip */}
      <div className="border-b border-line/60 bg-gradient-to-r from-[#FAE8EC]/80 via-[#FCF0F2]/60 to-[#FAE8EC]/80 py-4 px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-[11px] sm:text-xs text-charcoal font-semibold">
          <div className="flex items-center justify-center gap-2 group">
            <FastTruckIcon className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 transition-transform group-hover:scale-110" />
            <span className="text-black">Free Delivery Over Rs. 3,500</span>
          </div>
          <div className="flex items-center justify-center gap-2 group">
            <DiscreetPackageIcon className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 transition-transform group-hover:scale-110" />
            <span className="text-black">100% Discreet Packaging</span>
          </div>
          <div className="flex items-center justify-center gap-2 group">
            <ExchangeBoxIcon className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 transition-transform group-hover:scale-110" />
            <span className="text-black">7-Day Size Exchange</span>
          </div>
          <div className="flex items-center justify-center gap-2 group">
            <SecureCoinsIcon className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 transition-transform group-hover:scale-110" />
            <span className="text-black">Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* 2. Main Organized Compact Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
          {/* Brand Info (Col 1-4) */}
          <div className="md:col-span-4 space-y-3">
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
                className="rounded-full border border-line p-2 text-charcoal transition-all duration-200 hover:border-[#7A2A3D] hover:text-[#7A2A3D] hover:bg-blush hover:scale-110"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="https://facebook.com"
                aria-label="KAYFIY on Facebook"
                className="rounded-full border border-line p-2 text-charcoal transition-all duration-200 hover:border-[#7A2A3D] hover:text-[#7A2A3D] hover:bg-blush hover:scale-110"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
              </Link>
              <a
                href="https://wa.me/923053530008"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KAYFIY on WhatsApp"
                className="rounded-full border border-line p-2 text-charcoal transition-all duration-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 hover:scale-110"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
              </a>
              <Link
                href="https://tiktok.com"
                aria-label="KAYFIY on TikTok"
                className="rounded-full border border-line p-2 text-charcoal transition-all duration-200 hover:border-[#7A2A3D] hover:text-[#7A2A3D] hover:bg-blush hover:scale-110"
              >
                <TikTokIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Links (2-Column Grid on Mobile for compact height) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {/* Shop Column */}
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-charcoal tracking-wide">
                Shop
              </h3>
              <ul className="mt-3 space-y-2">
                {topCategories.map((item) => (
                  <li key={item.href || item.label}>
                    <Link
                      href={item.href}
                      className="text-xs text-muted transition-all duration-200 hover:text-[#7A2A3D] hover:translate-x-0.5 inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help / Information Column */}
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-charcoal tracking-wide">
                Customer Care
              </h3>
              <ul className="mt-3 space-y-2">
                {helpLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs text-muted transition-all duration-200 hover:text-[#7A2A3D] hover:translate-x-0.5 inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter / Contact (Col 10-12) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-charcoal tracking-wide">
              Stay in Touch
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Fit tips, restock alerts & new launches.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Bar with Payment Badges */}
      <div className="border-t border-line/70 py-4 px-4 bg-white/40">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted">
          <p>© {new Date().getFullYear()} KAYFIY. All rights reserved.</p>
          
          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#1A1F71] px-2 py-0.5 text-[9px] font-bold text-white tracking-wider">VISA</span>
            <span className="rounded bg-[#EB001B] px-2 py-0.5 text-[9px] font-bold text-white tracking-wider">MC</span>
            <span className="rounded bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white tracking-wider">COD</span>
            <span className="rounded bg-[#ED1C24] px-2 py-0.5 text-[9px] font-bold text-white tracking-wider">JazzCash</span>
            <span className="rounded bg-[#00C853] px-2 py-0.5 text-[9px] font-bold text-white tracking-wider">EasyPaisa</span>
          </div>

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
