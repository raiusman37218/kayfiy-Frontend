import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://lavembmsofbxilinjlik.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdmVtYm1zb2ZieGlsaW5qbGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5Nzg4NDIsImV4cCI6MjEwMzU1NDg0Mn0.dXIdv7LVeZy77JT56g6dfT7ksTtrZj9Qwiab9PLvvyw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbProduct = {
  id: string;
  created_at?: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  color?: string;
  size?: string;
  img?: string;
  instock?: boolean;
  new?: boolean;
  bestsellere?: boolean;
  stock_id?: string;
  article_number?: string;
  delivery_fee_mode?: string;
  delivery_fee_pkr?: number;
  cost_total_pkr?: number;
  inventory?: {
    stock_quantity: number;
    low_stock_threshold?: number;
    sku?: string;
  }[];
};

export type DbStoreSettings = {
  id: number;
  cod_delivery_fee_pkr: number;
  free_delivery_threshold_pkr: number;
  advance_delivery_fee_pkr: number;
  announcement_enabled: boolean;
  announcement_text: string;
  announcement_link_label?: string;
  announcement_link_href?: string;
  announcements?: Array<{
    id: string;
    text: string;
    enabled: boolean;
    linkHref?: string;
    linkLabel?: string;
  }>;
  hero_enabled?: boolean;
  hero_eyebrow?: string;
  hero_heading?: string;
  hero_supporting_text?: string;
  hero_primary_button_text?: string;
  hero_primary_button_link?: string;
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_slug?: string | null;
  status: string;
  sort_order: number;
  show_in_header?: boolean;
  show_on_homepage?: boolean;
  show_in_footer?: boolean;
  show_in_search?: boolean;
};

export async function fetchDbProducts(): Promise<DbProduct[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, inventory(stock_quantity, low_stock_threshold, sku)")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchDbProducts error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase fetchDbProducts exception:", err);
    return [];
  }
}

export async function fetchDbStoreSettings(): Promise<DbStoreSettings | null> {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetchDbStoreSettings error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Supabase fetchDbStoreSettings exception:", err);
    return null;
  }
}

export type DbReview = {
  id: string;
  product_slug: string | null;
  author_name: string;
  rating: number;
  title?: string;
  body: string;
  is_featured?: boolean;
  created_at?: string;
};

export async function fetchDbReviews(): Promise<DbReview[]> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchDbReviews error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase fetchDbReviews exception:", err);
    return [];
  }
}

export async function fetchDbCategories(): Promise<DbCategory[]> {
  try {
    const { data, error } = await supabase
      .from("catalog_categories")
      .select("*")
      .eq("status", "Active")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.warn("Supabase fetchDbCategories error:", error.message);
      return [];
    }

    return (data || []).map((cat: any) => ({
      ...cat,
      parent_slug: cat.parent_slug || null,
      sort_order: Number(cat.sort_order ?? 0),
      show_in_header: cat.show_in_header ?? true,
      show_on_homepage: cat.show_on_homepage ?? true,
      show_in_footer: cat.show_in_footer ?? false,
      show_in_search: cat.show_in_search ?? true,
    }));
  } catch (err) {
    console.warn("Supabase fetchDbCategories exception:", err);
    return [];
  }
}

