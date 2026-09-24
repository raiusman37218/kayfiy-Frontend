import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCatalogCategories, normalizeCategoryRecord } from "@/lib/admin/categories";
import { authorizeAdminRequest } from "@/lib/admin/adminAuth";
import { supabaseAdminRequest } from "@/lib/admin/supabaseRest";
import { invalidateCatalogCache } from "@/lib/admin/catalog";
import { slugifyCategory } from "@/data/store";

function errorResponse(error) {
  const unauthorized = error.status === 401 || error.status === 403;
  const validation = error.status === 400 || error.status === 422;
  return NextResponse.json(
    { error: unauthorized || validation ? error.message : error.message || "Unable to update categories." },
    { status: unauthorized || validation ? error.status : 500 }
  );
}

function validationError(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function tableMissing(error) {
  const message = `${error?.message || ""} ${JSON.stringify(error?.details || {})}`.toLowerCase();
  return error?.status === 404 || message.includes("catalog_categories") || message.includes("schema cache");
}

function payloadToRecord(category = {}) {
  const name = String(category.name || "").trim();
  let rawSlug = String(category.slug || "").trim().toLowerCase();
  if (!rawSlug) rawSlug = slugifyCategory(name);
  const slug = rawSlug.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const parentSlug = String(category.parentSlug || category.parent_slug || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || null;
  const status = category.status || "Active";
  if (!name) throw validationError("Category name is required.");
  if (name.length > 80) throw validationError("Category name is too long.");
  if (!slug) throw validationError("Category slug is required.");
  if (parentSlug && parentSlug === slug) throw validationError("A category cannot be its own parent.");
  if (!["Active", "Draft", "Archived"].includes(status)) throw validationError("Category status is invalid.");
  return {
    name,
    slug,
    description: String(category.description || "").trim(),
    image: String(category.image || "").trim(),
    parent_slug: parentSlug,
    status,
    sort_order: Math.max(0, Math.min(9999, Number(category.sortOrder ?? category.sort_order ?? 100) || 100)),
    show_in_header: Boolean(category.showInHeader ?? category.show_in_header ?? true),
    show_on_homepage: Boolean(category.showOnHomepage ?? category.show_on_homepage ?? true),
    show_in_footer: Boolean(category.showInFooter ?? category.show_in_footer ?? true),
    show_in_search: Boolean(category.showInSearch ?? category.show_in_search ?? true),
    seo_title: String(category.seoTitle || category.seo_title || "").trim(),
    seo_description: String(category.seoDescription || category.seo_description || "").trim(),
    image_alt: String(category.imageAlt || category.image_alt || name).trim(),
  };
}

async function sendTableSetupFallback() {
  return NextResponse.json({
    categories: [],
    needsSetup: true,
    setupSql: "scripts/supabase-catalog-categories.sql",
  });
}

function revalidateCategoryPages(slugs = []) {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/collections/[slug]", "page");
    for (const slug of slugs.filter(Boolean)) {
      revalidatePath(`/collections/${slug}`, "page");
    }
  } catch (err) {
    console.warn("revalidateCategoryPages warning:", err);
  }
}

export async function GET() {
  try {
    const categories = await getCatalogCategories({ admin: false, includeInactive: false });
    return NextResponse.json({ categories });
  } catch (error) {
    if (tableMissing(error)) return sendTableSetupFallback();
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    await authorizeAdminRequest(request, "products");
    try {
      return NextResponse.json({
        categories: await getCatalogCategories({ admin: true, includeInactive: true }),
      });
    } catch (error) {
      if (tableMissing(error)) return sendTableSetupFallback();
      throw error;
    }
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request) {
  try {
    await authorizeAdminRequest(request, "products");
    const body = await request.json();
    const record = payloadToRecord(body.category || {});
    try {
      const created = await supabaseAdminRequest("catalog_categories?on_conflict=slug&select=*", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: record,
      });
      invalidateCatalogCache();
      revalidateCategoryPages([record.slug, record.parent_slug]);
      return NextResponse.json({ success: true, category: normalizeCategoryRecord(created?.[0]) });
    } catch (error) {
      if (!tableMissing(error)) throw error;
      return sendTableSetupFallback();
    }
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request) {
  try {
    await authorizeAdminRequest(request, "products");
    const body = await request.json();
    const categoryId = body.categoryId;
    if (!categoryId) throw new Error("Category is required.");
    const record = payloadToRecord(body.category || {});
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(categoryId));
    const filter = isUuid ? `id=eq.${encodeURIComponent(categoryId)}` : `slug=eq.${encodeURIComponent(categoryId)}`;
    try {
      // Find old category details before update
      const existingRows = await supabaseAdminRequest(`catalog_categories?${filter}&select=*`).catch(() => []);
      const oldCategory = existingRows?.[0];

      const updated = await supabaseAdminRequest(`catalog_categories?${filter}&select=*`, {
        method: "PATCH",
        prefer: "return=representation",
        body: record,
      });
      if (!updated?.length) {
        throw Object.assign(new Error("Category not found."), { status: 404 });
      }

      // If category slug changed, update children's parent_slug
      if (oldCategory && oldCategory.slug !== record.slug) {
        await supabaseAdminRequest(`catalog_categories?parent_slug=eq.${encodeURIComponent(oldCategory.slug)}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: { parent_slug: record.slug },
        }).catch(() => {});
      }

      // If category name changed, update products that had this category name
      if (oldCategory && oldCategory.name !== record.name) {
        try {
          const prods = await supabaseAdminRequest("products?select=id,category").catch(() => []);
          for (const p of prods || []) {
            if (!p.category) continue;
            let updatedCat = null;
            if (p.category === oldCategory.name) {
              updatedCat = record.name;
            } else if (p.category.startsWith(`${oldCategory.name}||`)) {
              updatedCat = `${record.name}||${p.category.slice(oldCategory.name.length + 2)}`;
            }
            if (updatedCat) {
              await supabaseAdminRequest(`products?id=eq.${encodeURIComponent(p.id)}`, {
                method: "PATCH",
                prefer: "return=minimal",
                body: { category: updatedCat },
              }).catch(() => {});
            }
          }
        } catch (err) {
          console.warn("Failed to sync products with updated category name:", err);
        }
      }

      // If subcategory slug changed, update products that had this subcategory
      if (oldCategory && oldCategory.parent_slug && oldCategory.slug !== record.slug) {
        try {
          const prods = await supabaseAdminRequest("products?select=id,category").catch(() => []);
          for (const p of prods || []) {
            if (!p.category || !p.category.includes(`||${oldCategory.slug}||`)) continue;
            const updatedCat = p.category.replace(`||${oldCategory.slug}||`, `||${record.slug}||`);
            await supabaseAdminRequest(`products?id=eq.${encodeURIComponent(p.id)}`, {
              method: "PATCH",
              prefer: "return=minimal",
              body: { category: updatedCat },
            }).catch(() => {});
          }
        } catch (err) {
          console.warn("Failed to sync products with updated subcategory slug:", err);
        }
      }

      invalidateCatalogCache();
      revalidateCategoryPages([record.slug, oldCategory?.slug, record.parent_slug]);
      return NextResponse.json({ success: true, category: normalizeCategoryRecord(updated?.[0]) });
    } catch (error) {
      if (!tableMissing(error)) throw error;
      return sendTableSetupFallback();
    }
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request) {
  try {
    await authorizeAdminRequest(request, "products");
    const { categoryId } = await request.json();
    if (!categoryId) throw new Error("Category is required.");
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(categoryId));
    const filter = isUuid ? `id=eq.${encodeURIComponent(categoryId)}` : `slug=eq.${encodeURIComponent(categoryId)}`;
    try {
      const existingRows = await supabaseAdminRequest(`catalog_categories?${filter}&select=*`).catch(() => []);
      const oldCategory = existingRows?.[0];

      await supabaseAdminRequest(`catalog_categories?${filter}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: { status: "Archived" },
      });

      // If it's a main category, also archive child subcategories
      if (oldCategory?.slug) {
        await supabaseAdminRequest(`catalog_categories?parent_slug=eq.${encodeURIComponent(oldCategory.slug)}`, {
          method: "PATCH",
          prefer: "return=minimal",
          body: { status: "Archived" },
        }).catch(() => {});
      }

      invalidateCatalogCache();
      revalidateCategoryPages([oldCategory?.slug, oldCategory?.parent_slug]);
      return NextResponse.json({ success: true, archived: true });
    } catch (error) {
      if (!tableMissing(error)) throw error;
      return sendTableSetupFallback();
    }
  } catch (error) {
    return errorResponse(error);
  }
}
