import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/admin/storeSettings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({
      settings,
      paymentSettings: settings.paymentSettings,
    });
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Failed to load settings", paymentSettings: null }, { status: 500 });
  }
}
