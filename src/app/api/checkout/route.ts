import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createServerSupabase } from "@/lib/customerAuthServer";

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

    const { data: settings } = await supabase
      .from("store_settings")
      .select("cod_delivery_fee_pkr, free_delivery_threshold_pkr")
      .eq("id", 1)
      .maybeSingle();

    if (settings) {
      shippingFee = Number(settings.cod_delivery_fee_pkr) || 199;
      freeThreshold = Number(settings.free_delivery_threshold_pkr) || 3500;
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const finalShippingFee = subtotal >= freeThreshold ? 0 : shippingFee;
    const total = subtotal + finalShippingFee;

    const fullName = `${firstName} ${lastName}`.trim();
    const orderNumber = `KF-${Date.now().toString().slice(-6)}`;
    const orderId = crypto.randomUUID();

    const isCod = paymentMethod === "cod";
    const amountAdvance = isCod ? 0 : total;
    const amountCod = isCod ? total : 0;

    // Associate the order with the customer when one is signed in; guest
    // checkout still works and leaves user_id null.
    let userId: string | null = null;
    try {
      const authClient = await createServerSupabase();
      const {
        data: { user },
      } = await authClient.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      userId = null;
    }

    // 1. Insert into orders table
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      order_number: orderNumber,
      user_id: userId,
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
      // If item.id is a valid uuid, link it to product_id
      const isValidUuid =
        item.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          item.id,
        );

      return {
        order_id: orderId,
        product_id: isValidUuid ? item.id : null,
        title: item.name,
        unit_price_pkr: item.price,
        quantity: item.qty,
        line_total_pkr: item.price * item.qty,
        size: item.size || "Standard",
        color: item.color || "Standard",
        image_url: item.image || "",
      };
    });

    const { error: itemsError } = await supabase
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
