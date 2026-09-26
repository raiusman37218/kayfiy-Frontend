-- Migration 007: Update admin_delete_product_v2 to permanently delete any product cleanly
-- Unlinks order_items (setting product_id to NULL) so order history, line item title/price/specs,
-- and financial records remain intact, while cleanly cascading inventory, movements, tryon cache,
-- and removing the product row from public.products.

CREATE OR REPLACE FUNCTION public.admin_delete_product_v2(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Unlink order items so customer receipts, line item specs, and order history are completely preserved
  UPDATE public.order_items SET product_id = NULL WHERE product_id = p_id;

  -- 2. Delete virtual try-on cache for this product
  DELETE FROM public.tryon_cache WHERE product_id = p_id::text;

  -- 3. Delete inventory movements
  DELETE FROM public.inventory_movements WHERE product_id = p_id;

  -- 4. Delete inventory record
  DELETE FROM public.inventory WHERE product_id = p_id;

  -- 5. Delete product row from products table
  DELETE FROM public.products WHERE id = p_id;

  RETURN FOUND;
END;
$$;
