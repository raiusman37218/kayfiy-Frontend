"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { createBrowserSupabase } from "@/lib/customerAuth";

export type WishlistLine = {
  slug: string;
  name: string;
  image: string;
  price: number;
};

const STORAGE_KEY = "kayfiy-wishlist";
const EMPTY: WishlistLine[] = [];

let items: WishlistLine[] = EMPTY;
let hydrated = false;
let userId: string | null = null;
let mergedForUser: string | null = null;
let authInitialized = false;
const listeners = new Set<() => void>();

function readStorage(): WishlistLine[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as WishlistLine[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeStorage(next: WishlistLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function update(next: WishlistLine[]) {
  items = next;
  if (!userId) writeStorage(next);
  emit();
}

async function fetchRemoteWishlist(uid: string) {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("product_slug, product_name, product_image, product_price")
    .eq("user_id", uid);
  if (error) {
    console.warn("Wishlist fetch error:", error.message);
    return;
  }
  items = (data || []).map((row) => ({
    slug: row.product_slug as string,
    name: row.product_name as string,
    image: (row.product_image as string) || "",
    price: Number(row.product_price ?? 0),
  }));
  emit();
}

async function mergeLocalIntoRemote(uid: string) {
  if (mergedForUser === uid) return;
  mergedForUser = uid;
  const local = readStorage();
  if (local.length > 0) {
    const supabase = createBrowserSupabase();
    await supabase.from("wishlist_items").upsert(
      local.map((line) => ({
        user_id: uid,
        product_slug: line.slug,
        product_name: line.name,
        product_image: line.image,
        product_price: line.price,
      })),
      { onConflict: "user_id,product_slug", ignoreDuplicates: true },
    );
    writeStorage([]);
  }
  await fetchRemoteWishlist(uid);
}

function handleAuthChange(nextUserId: string | null) {
  const wasGuest = !userId;
  userId = nextUserId;
  if (nextUserId) {
    if (wasGuest) {
      void mergeLocalIntoRemote(nextUserId);
    } else {
      void fetchRemoteWishlist(nextUserId);
    }
  } else {
    mergedForUser = null;
    items = readStorage();
    emit();
  }
}

function ensureAuthListener() {
  if (authInitialized) return;
  authInitialized = true;
  const supabase = createBrowserSupabase();
  supabase.auth.getUser().then(({ data }) => {
    handleAuthChange(data.user?.id ?? null);
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    handleAuthChange(session?.user?.id ?? null);
  });
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    items = readStorage();
    ensureAuthListener();
  }
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || userId) return;
    items = readStorage();
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => items;
const getServerSnapshot = () => EMPTY;
const getReady = () => hydrated;
const getServerReady = () => false;

export function useWishlist() {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const ready = useSyncExternalStore(subscribe, getReady, getServerReady);

  const has = useCallback(
    (slug: string) => current.some((item) => item.slug === slug),
    [current],
  );

  const add = useCallback((line: WishlistLine) => {
    if (items.some((item) => item.slug === line.slug)) return;
    update([...items, line]);
    if (userId) {
      const supabase = createBrowserSupabase();
      supabase
        .from("wishlist_items")
        .upsert(
          {
            user_id: userId,
            product_slug: line.slug,
            product_name: line.name,
            product_image: line.image,
            product_price: line.price,
          },
          { onConflict: "user_id,product_slug" },
        )
        .then(({ error }) => {
          if (error) console.warn("Wishlist add error:", error.message);
        });
    }
  }, []);

  const remove = useCallback((slug: string) => {
    update(items.filter((item) => item.slug !== slug));
    if (userId) {
      const supabase = createBrowserSupabase();
      supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_slug", slug)
        .then(({ error }) => {
          if (error) console.warn("Wishlist remove error:", error.message);
        });
    }
  }, []);

  const toggle = useCallback(
    (line: WishlistLine) => {
      if (items.some((item) => item.slug === line.slug)) {
        remove(line.slug);
      } else {
        add(line);
      }
    },
    [add, remove],
  );

  return useMemo(
    () => ({
      items: current,
      count: current.length,
      ready,
      has,
      add,
      remove,
      toggle,
    }),
    [current, ready, has, add, remove, toggle],
  );
}
