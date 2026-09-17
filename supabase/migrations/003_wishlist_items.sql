-- 003_wishlist_items.sql
-- Adds a `wishlist_items` table for signed-in customer wishlists.
-- Guests keep using localStorage in the app; this table only backs
-- signed-in sessions. Additive only. Safe to run in the Supabase SQL editor.

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  product_image text,
  product_price numeric,
  created_at timestamptz not null default now(),
  unique (user_id, product_slug)
);

create index if not exists wishlist_items_user_id_idx on public.wishlist_items (user_id);

alter table public.wishlist_items enable row level security;

drop policy if exists "wishlist_items_all_own" on public.wishlist_items;
create policy "wishlist_items_all_own"
  on public.wishlist_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
