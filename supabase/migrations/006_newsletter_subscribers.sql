-- 006_newsletter_subscribers.sql
-- Adds a `newsletter_subscribers` table backing the newsletter signup
-- forms (homepage + footer). Additive only. Safe to run in the Supabase
-- SQL editor.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter_insert_anyone" on public.newsletter_subscribers;
create policy "newsletter_insert_anyone"
  on public.newsletter_subscribers for insert
  with check (true);
