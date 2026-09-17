-- 002_addresses.sql
-- Adds a `addresses` table so signed-in customers can save shipping
-- addresses. Additive only. Safe to run in the Supabase SQL editor.

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  postal_code text,
  country text not null default 'Pakistan',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses (user_id);

alter table public.addresses enable row level security;

drop policy if exists "addresses_all_own" on public.addresses;
create policy "addresses_all_own"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
