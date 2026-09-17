# Kayfiy Supabase migrations

Run these once, in order, in the Supabase Dashboard: **SQL Editor -> New query**,
paste each file's contents, and run it. Each file is additive (new tables /
new nullable column) and safe to re-run (`if not exists`, `drop policy if
exists`).

1. `001_profiles.sql`
2. `002_addresses.sql`
3. `003_wishlist_items.sql`
4. `004_orders_user_id.sql` — **read the comment at the top of this file
   first**; it's the only one touching an existing table.
5. `005_reviews.sql`
6. `006_newsletter_subscribers.sql`

After running these, go to **Authentication -> Providers** and confirm
**Email** sign-in is enabled (it's on by default for new Supabase projects,
but worth checking since this project had no customer-facing auth before).
