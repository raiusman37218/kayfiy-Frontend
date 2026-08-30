"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import KayfiyLogo from "./KayfiyLogo";
import { navigation as defaultNav, slug, type NavItem } from "@/lib/data";
import { fetchDbCategories, supabase, type DbCategory } from "@/lib/supabase";
import { useCart } from "./useCart";
import HeaderSearch from "./HeaderSearch";
import SearchDrawer from "./SearchDrawer";
import {
  AccountIcon,
  CartIcon,
  ChevronIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "./Icons";

function buildNavigation(categories: DbCategory[]): NavItem[] {
  if (!categories || categories.length === 0) return defaultNav;

  // Filter top-level categories (categories without a parent)
  const topLevel = categories.filter((c) => !c.parent_slug);

  return topLevel.map((parent) => {
    // Find any real subcategories that have parent_slug matching this parent
    const childCats = categories.filter((c) => c.parent_slug === parent.slug);

    const children =
      childCats.length > 0
        ? childCats.map((child) => ({
            label: child.name,
            href: `/collections/${child.slug}`,
          }))
        : undefined;

    return {
      label: parent.name,
      href: `/collections/${parent.slug}`,
      mega: Boolean(children && children.length > 4),
      children,
    };
  });
}

export default function Header() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNav);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const { count, openCart } = useCart();

  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchDbCategories();
      if (cats && cats.length > 0) {
        setNavItems(buildNavigation(cats));
      }
    }
    loadCategories();

    // Subscribe to realtime category updates from Supabase
    const channel = supabase
      .channel("realtime-categories")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "catalog_categories" },
        () => {
          loadCategories();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (pathname === "/checkout") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/98 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 sm:h-18 lg:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 relative">
        {/* Left Side: 3-Lines Hamburger Menu (Mobile) | Desktop Search Input */}
        <div className="flex flex-1 items-center justify-start gap-2">
          <button
            type="button"
            className="-ml-2 rounded-full p-2 text-charcoal transition hover:bg-blush lg:hidden cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
          
          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div className="hidden lg:block">
            <HeaderSearch />
          </div>
        </div>

        {/* Center: KAYFIY Logo (Dead Center on Mobile and Desktop) */}
        <div className="flex items-center justify-center shrink-0">
          <Link
            href="/"
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(false);
            }}
            className="relative flex items-center justify-center py-1 transition duration-200 group cursor-pointer"
            aria-label="KAYFIY"
          >
            <KayfiyLogo size="lg" />
          </Link>
        </div>

        {/* Right Side: Search Icon (Mobile Only), Account Icon, Cart */}
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          {/* Mobile Search Icon Button -> Opens SearchDrawer */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="rounded-full p-2 text-charcoal transition hover:bg-blush lg:hidden cursor-pointer"
            aria-label="Search products"
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          <Link
            href="/account"
            className="rounded-full p-2 text-charcoal transition hover:bg-blush"
            aria-label="Account"
          >
            <AccountIcon className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2 text-charcoal transition hover:bg-blush cursor-pointer"
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <CartIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C4526E] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop mega-menu bar — no dividing line above */}
      <nav
        aria-label="Primary"
        className="hidden bg-white/95 lg:block -mt-1 pb-1"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <ul className="relative mx-auto flex max-w-7xl items-center justify-center px-6">
          {navItems.map((item) => {
            const isOpen = openMenu === item.label;
            return (
              <li
                key={item.label}
                className={item.mega ? "static" : "relative"}
                onMouseEnter={() =>
                  setOpenMenu(item.children ? item.label : null)
                }
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-3 text-[13px] tracking-[0.1em] text-charcoal uppercase transition hover:text-rose xl:px-4"
                  aria-expanded={item.children ? isOpen : undefined}
                  onFocus={() => setOpenMenu(item.children ? item.label : null)}
                >
                  {item.label}
                  {item.children && (
                    <ChevronIcon
                      className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                {item.children && isOpen && (
                  <div
                    className={
                      item.mega
                        ? "absolute inset-x-0 top-full z-10 border-t border-line bg-cream shadow-[0_18px_40px_-24px_rgba(43,39,36,0.4)]"
                        : "absolute top-full z-10 w-60 rounded-b-2xl border border-t-0 border-line bg-cream p-2 shadow-[0_18px_40px_-24px_rgba(43,39,36,0.4)]"
                    }
                  >
                    {item.mega ? (
                      <div className="mx-auto max-w-7xl px-6 py-8">
                        <p className="font-serif text-lg text-charcoal">
                          Shop Bras
                        </p>
                        <ul className="mt-4 grid grid-cols-3 gap-x-8 gap-y-1 xl:grid-cols-4">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                className="block py-1.5 text-sm text-muted transition hover:text-rose"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-blush hover:text-rose"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile accordion menu */}
      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-cream px-4 pb-8 lg:hidden"
        >
          <ul className="divide-y divide-line">
            {navItems.map((item) => {
              const expanded = mobileSection === item.label;
              return (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between py-3.5 text-sm tracking-[0.1em] uppercase"
                        aria-expanded={expanded}
                        onClick={() =>
                          setMobileSection(expanded ? null : item.label)
                        }
                      >
                        {item.label}
                        <ChevronIcon
                          className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      {expanded && (
                        <ul className="pb-3 pl-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                className="block py-2 text-sm text-muted"
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3.5 text-sm tracking-[0.1em] uppercase"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Slide-over Live Search Modal Interface */}
      <SearchDrawer
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}
