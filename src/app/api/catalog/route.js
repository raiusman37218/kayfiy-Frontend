import { NextResponse } from "next/server";
import { getCatalogCategories } from "@/lib/admin/categories";
import { getCatalogProducts } from "@/lib/admin/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [products, categories] = await Promise.all([
      getCatalogProducts(),
      getCatalogCategories(),
    ]);
    return NextResponse.json({ products, categories });
  } catch (err) {
    console.error("API /api/catalog error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load catalog", products: [], categories: [] },
      { status: 500 }
    );
  }
}
