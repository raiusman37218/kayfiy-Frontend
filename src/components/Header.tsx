"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/data";
import { useCart } from "./useCart";
import {
  AccountIcon,
  CartIcon,
  ChevronIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "./Icons";

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20">
        <div className="flex flex-1 items-center gap-1">
          <button
            type="button"
            className="-ml-2 rounded-full p-2 text-charcoal transition hover:bg-blush lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-charcoal transition hover:bg-blush"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>

        <Link
          href="/"
          className="font-serif text-3xl leading-none font-semibold tracking-[0.22em] text-charcoal uppercase lg:text-4xl"
        >
          Lisset
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1">
          <Link
            href="/account"
            className="rounded-full p-2 text-charcoal transition hover:bg-blush"
            aria-label="Account"
          >
            <AccountIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-charcoal transition hover:bg-blush"
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <CartIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-line bg-blush/40">
          <form
            className="mx-auto flex max-w-3xl gap-2 px-4 py-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="site-search" className="sr-only">
              Search Lisset
            </label>
            <input
              id="site-search"
              type="search"
              placeholder="Search bras, panties, nightwear"
              className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-rose"
            />
            <button
              type="submit"
              className="rounded-full bg-charcoal px-5 py-2 text-xs tracking-[0.14em] text-cream uppercase transition hover:bg-rose"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Desktop mega-menu bar */}
      <nav
        aria-label="Primary"
        className="hidden border-t border-line lg:block"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <ul className="relative mx-auto flex max-w-7xl items-center justify-center px-6">
          {navigation.map((item) => {
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
            {navigation.map((item) => {
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
    </header>
  );
}
