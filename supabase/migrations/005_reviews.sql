-- 005_reviews.sql
-- Adds a `reviews` table for product reviews / homepage testimonials.
-- Read-only from the storefront in this pass (no public submission form
-- yet) -- rows are added directly in Supabase or by a future admin screen.
-- Additive only. Safe to run in the Supabase SQL editor.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text not null,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_slug_idx on public.reviews (product_slug);
create index if not exists reviews_is_featured_idx on public.reviews (is_featured);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public"
  on public.reviews for select
  using (true);
