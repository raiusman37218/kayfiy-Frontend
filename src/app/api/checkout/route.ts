import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://lavembmsofbxilinjlik.supabase.co";

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

// Prefer service-role client on server to bypass RLS and guarantee order persistence
const dbClient = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : supabase;

type CheckoutItem = {
  id?: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  image?: string;
  slug?: string;
};

type CheckoutPayload = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode?: string;
  notes?: string;
  paymentMethod: string;
  discountCode?: string;
  discountAmount?: number;
  items: CheckoutItem[];
};

export async function POST(request: Request) {
  try {
    const body: CheckoutPayload = await request.json();
    const {
      email,
      phone,
      firstName,
      lastName,
      address,
      city,
      postcode,
      notes,
      paymentMethod,
      discountCode,
      discountAmount = 0,
      items,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 },
      );
    }

    if (!email || !phone || !firstName || !address || !city) {
      return NextResponse.json(
        { error: "Please fill in all required customer fields." },
        { status: 400 },
      );
    }

    // Fetch store settings for delivery fee calculation
    let shippingFee = 199;
    let freeThreshold = 3500;

    const { data: settings } = await dbClient
      .from("store_settings")
      .select("cod_delivery_fee_pkr, free_delivery_threshold_pkr")
      .eq("id", 1)
      .maybeSingle();

    if (settings) {
      shippingFee = Number(settings.cod_delivery_fee_pkr) || 199;
      freeThreshold = Number(settings.free_delivery_threshold_pkr) || 3500;
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0,
    );
    const numericDiscount = Number(discountAmount) || 0;
    const finalShippingFee = subtotal >= freeThreshold ? 0 : shippingFee;
    const total = Math.max(0, subtotal - numericDiscount + finalShippingFee);

    const fullName = `${firstName} ${lastName || ""}`.trim();
    const orderNumber = `KF-${Date.now().toString().slice(-6)}`;
    const orderId = crypto.randomUUID();

    const isCod = paymentMethod === "cod";
    const amountAdvance = isCod ? 0 : total;
    const amountCod = isCod ? total : 0;

    // 1. Insert into orders table via service client
    const { error: orderError } = await dbClient.from("orders").insert({
      id: orderId,
      order_number: orderNumber,
      guest_name: fullName,
      guest_email: email,
      guest_phone: phone,
      customer_email: email,
      shipping_full_name: fullName,
      shipping_phone: phone,
      shipping_line1: address,
      shipping_city: city,
      shipping_country: "Pakistan",
      shipping_postal_code: postcode || "",
      subtotal_pkr: subtotal,
      product_subtotal_pkr: subtotal,
      shipping_fee_pkr: finalShippingFee,
      delivery_charges_pkr: finalShippingFee,
      discount_amount_pkr: numericDiscount,
      discount_code: discountCode || null,
      total_pkr: total,
      total_order_value_pkr: total,
      amount_payable_in_advance_pkr: amountAdvance,
      amount_payable_on_delivery_pkr: amountCod,
      payment_method: paymentMethod,
      payment_status: isCod ? "Awaiting Payment" : "Awaiting Bank Transfer",
      order_confirmation_status: "Pending Confirmation",
      fulfillment_status: "On hold",
      status: "pending",
      notes: notes || "",
    });

    if (orderError) {
      console.error("Supabase order insert error:", orderError);
      return NextResponse.json(
        { error: `Could not save order: ${orderError.message}` },
        { status: 500 },
      );
    }

    // 2. Insert order items
    const orderItems = items.map((item) => {
      const isValidUuid =
        item.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          item.id,
        );

      return {
        order_id: orderId,
        product_id: isValidUuid ? item.id : null,
        title: item.name,
        unit_price_pkr: Number(item.price),
        quantity: Number(item.qty),
        line_total_pkr: Number(item.price) * Number(item.qty),
        size: item.size || "Standard",
        color: item.color || "Standard",
        image_url: item.image || "",
      };
    });

    const { error: itemsError } = await dbClient
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Supabase order items insert error:", itemsError);
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      subtotal,
      shipping: finalShippingFee,
      discount: numericDiscount,
      total,
      fullName,
      email,
    });
  } catch (error: any) {
    console.error("Checkout route error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
