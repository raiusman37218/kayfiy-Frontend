"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export type CartLine = {
  id?: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

const STORAGE_KEY = "kayfiy-cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let isDrawerOpen = false;
let hydrated = false;
const listeners = new Set<() => void>();

function readStorage(): CartLine[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartLine[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeStorage(next: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    lines = readStorage();
  }
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    lines = readStorage();
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(next: CartLine[]) {
  lines = next;
  writeStorage(next);
  emit();
}

export function setDrawerOpen(open: boolean) {
  isDrawerOpen = open;
  emit();
}

const getSnapshot = () => lines;
const getServerSnapshot = () => EMPTY;
const getReady = () => hydrated;
const getServerReady = () => false;
const getDrawerOpenSnapshot = () => isDrawerOpen;
const getServerDrawerOpenSnapshot = () => false;

export function useCart() {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const ready = useSyncExternalStore(subscribe, getReady, getServerReady);
  const isOpen = useSyncExternalStore(
    subscribe,
    getDrawerOpenSnapshot,
    getServerDrawerOpenSnapshot,
  );

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1, openDrawer = true) => {
    const index = lines.findIndex(
      (item) => item.slug === line.slug && item.size === line.size,
    );
    if (index === -1) {
      update([...lines, { ...line, qty }]);
    } else {
      const next = [...lines];
      next[index] = { ...next[index], qty: next[index].qty + qty };
      update(next);
    }
    if (openDrawer) {
      setDrawerOpen(true);
    }
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    update(
      qty <= 0
        ? lines.filter((item) => !(item.slug === slug && item.size === size))
        : lines.map((item) =>
            item.slug === slug && item.size === size ? { ...item, qty } : item,
          ),
    );
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    update(lines.filter((item) => !(item.slug === slug && item.size === size)));
  }, []);

  const clear = useCallback(() => update(EMPTY), []);
  const openCart = useCallback(() => setDrawerOpen(true), []);
  const closeCart = useCallback(() => setDrawerOpen(false), []);
  const toggleCart = useCallback(() => setDrawerOpen(!isDrawerOpen), []);

  return useMemo(() => {
    const count = current.reduce((total, item) => total + item.qty, 0);
    const subtotal = current.reduce(
      (total, item) => total + item.price * item.qty,
      0,
    );
    return {
      lines: current,
      count,
      subtotal,
      ready,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      add,
      setQty,
      remove,
      clear,
    };
  }, [current, ready, isOpen, openCart, closeCart, toggleCart, add, setQty, remove, clear]);
}
