-- 004_orders_user_id.sql
--
-- IMPORTANT — read before running: this is the one migration that touches
-- an existing, live table. It only ADDS a nullable column and adds RLS
-- policies; it does not alter or delete any existing data. Before running,
-- open Supabase Dashboard -> Authentication -> Policies (or Table Editor ->
-- orders -> RLS) and check whether Row Level Security is already enabled on
-- `orders`/`order_items` with policies of your own. If it is, review the
-- policies below instead of assuming this is the first RLS on the table.
--
-- What this does:
--   1. Adds `orders.user_id` (nullable uuid) so a checkout made while signed
--      in can be associated with the customer. Guest checkout is untouched
--      -- `user_id` stays null for guest orders, exactly like today.
--   2. Enables RLS on `orders` and `order_items` with:
--        - a permissive INSERT policy (anyone can insert), matching the
--          app's current behavior where the checkout API inserts orders
--          using the anon key with no auth context.
--        - a SELECT policy so a signed-in customer can only see their own
--          orders (`auth.uid() = orders.user_id`).
--      The admin dashboard reads via the SERVICE ROLE key, which always
--      bypasses RLS, so admin order management is unaffected either way.

alter table public.orders
  add column if not exists user_id uuid references auth.users (id);

create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.orders enable row level security;

drop policy if exists "orders_insert_anyone" on public.orders;
create policy "orders_insert_anyone"
  on public.orders for insert
  with check (true);

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

alter table public.order_items enable row level security;

drop policy if exists "order_items_insert_anyone" on public.order_items;
create policy "order_items_insert_anyone"
  on public.order_items for insert
  with check (true);

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and auth.uid() = o.user_id
    )
  );
