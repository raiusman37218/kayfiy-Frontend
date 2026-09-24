import {
  bestSellers,
  braSets,
  bras,
  maternity,
  nightwear,
  panties,
  plusSize,
  sanitaryPads,
  shapewear,
  slug,
  type Product,
} from "./data";
import {
  fetchDbProducts,
  fetchDbCategories,
  type DbProduct,
  type DbCategory,
} from "./supabase";
import { BRA_IMAGES } from "./images";
import { parseCategorySelection } from "@/data/store";

/** Fallback static products list, de-duplicated by slug. */
export const allProducts: Product[] = (() => {
  const seen = new Map<string, Product>();
  for (const product of [
    ...bestSellers,
    ...bras,
    ...braSets,
    ...shapewear,
    ...panties,
    ...nightwear,
    ...sanitaryPads,
    ...maternity,
    ...plusSize,
  ]) {
    const key = slug(product.name);
    if (!seen.has(key)) seen.set(key, product);
  }
  return [...seen.values()];
})();

export const findProduct = (productSlug: string) =>
  allProducts.find((product) => slug(product.name) === productSlug);

export type Collection = {
  slug: string;
  title: string;
  blurb: string;
  products: Product[];
  parent?: { title: string; slug: string };
  subcategories?: { title: string; slug: string }[];
};

export function sanitizeProductImage(rawImg?: string | null): { primary: string; hover: string; all: string[] } {
  const fallback = BRA_IMAGES[0] || "/banners/hero-monsoon.jpg";
  if (!rawImg || typeof rawImg !== "string") {
    return { primary: fallback, hover: fallback, all: [fallback] };
  }

  let urls: string[] = [];
  const trimmed = rawImg.trim();

  // Handle JSON array from Admin upload (e.g. '["https://..."]')
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        urls = parsed.filter((item) => typeof item === "string" && (item.startsWith("http") || item.startsWith("/")));
      }
    } catch {
      // ignore JSON parse failure
    }
  } else if (trimmed.startsWith("http") || trimmed.startsWith("/")) {
    urls = [trimmed];
  } else if (trimmed.includes(",")) {
    urls = trimmed.split(",").map((s) => s.trim()).filter((s) => s.startsWith("http") || s.startsWith("/"));
  }

  const primary = urls[0] || fallback;
  const hover = urls[1] || urls[0] || fallback;
  const all = urls.length > 0 ? Array.from(new Set(urls)) : [fallback];
  return { primary, hover, all };
}

/** Convert Supabase DbProduct to storefront Product format */
export function mapDbProduct(p: DbProduct): Product {
  const compareAt = p.bestsellere
    ? Math.round(Number(p.price) * 1.35)
    : undefined;

  let rawSizes: string[] = [];
  if (p.size) {
    try {
      const parsed = JSON.parse(p.size);
      rawSizes = Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      rawSizes = p.size.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  if (!rawSizes.length) rawSizes = ["Standard"];

  let rawColors: string[] = [];
  if (p.color) {
    try {
      const parsed = JSON.parse(p.color);
      rawColors = Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      rawColors = p.color.split(",").map((c) => c.trim()).filter(Boolean);
    }
  }
  if (!rawColors.length) rawColors = ["Default"];

  const { primary, hover, all } = sanitizeProductImage(p.img);
  const categorySelection = parseCategorySelection(p.category);

  let fabric = "";
  let savedStatus = "";
  if (p.cost_breakdown) {
    try {
      const breakdown = typeof p.cost_breakdown === "object" ? p.cost_breakdown : JSON.parse(p.cost_breakdown);
      fabric = breakdown?.metadata?.fabricDetails || "";
      savedStatus = String(breakdown?.metadata?.status || "").trim();
    } catch {}
  }
  const status = savedStatus || (p.instock === false ? "Archived" : "Active");

  return {
    id: p.id,
    name: p.name,
    price: Number(p.price) || 0,
    compareAt,
    seed: p.name.length,
    image: primary,
    hoverImage: hover,
    images: all,
    description: p.description,
    category: categorySelection.category || p.category || "",
    subcategory: categorySelection.subcategory || "",
    collection: categorySelection.collection || "",
    status,
    sizes: rawSizes,
    colors: rawColors,
    instock: p.instock ?? true,
    bestsellere: p.bestsellere ?? false,
    new: p.new ?? false,
    articleNumber: p.article_number,
    stockQuantity: p.inventory?.[0]?.stock_quantity ?? 30,
    fabric,
  };
}

/** Fetch live products from Supabase with fallback to static catalog */
export async function getLiveProducts(): Promise<Product[]> {
  try {
    const dbRows = await fetchDbProducts();
    if (dbRows && dbRows.length > 0) {
      return dbRows
        .map(mapDbProduct)
        .filter((p) => p.status !== "Archived");
    }
  } catch (error) {
    console.warn("Failed to load products from DB, using fallback:", error);
  }
  return allProducts;
}

/** Find a single product by slug from Supabase, or fallback to static list */
export async function findLiveProduct(
  productSlug: string,
): Promise<Product | undefined> {
  const products = await getLiveProducts();
  return products.find((product) => slug(product.name) === productSlug);
}

/** Filter helpers */
const refine = (parentList: Product[], pattern: RegExp, exclude?: RegExp) => {
  const matched = parentList.filter(
    (product) =>
      pattern.test(product.name) && !(exclude && exclude.test(product.name)),
  );
  return matched.length >= 2 ? matched : parentList;
};

const define = (
  slugSource: string,
  title: string,
  blurb: string,
  products: Product[],
  parent?: { title: string; slug: string },
): Collection => ({
  slug: slug(slugSource),
  title,
  blurb,
  products,
  parent,
});

const braParent = { title: "Bras", slug: "bras" };
const pantyParent = { title: "Panties", slug: "panties" };
const nightParent = { title: "Nightwear", slug: "nightwear" };
const shapeParent = { title: "Shapewear", slug: "shapewear" };
const matParent = { title: "Maternity", slug: "maternity" };

export function buildCollections(products: Product[]): Collection[] {
  const sale = products.filter((p) => p.compareAt || p.bestsellere);
  const budget = products.filter((p) => p.price <= 1500);

  const brasList = products.filter(
    (p) => p.category?.toLowerCase() === "bras" || /bra/i.test(p.name),
  );
  const braSetsList = products.filter(
    (p) =>
      p.category?.toLowerCase() === "bra sets" ||
      (/set/i.test(p.name) && /bra/i.test(p.name)),
  );
  const pantiesList = products.filter(
    (p) =>
      p.category?.toLowerCase() === "panties" ||
      /panty|panties|brief/i.test(p.name),
  );
  const shapeList = products.filter(
    (p) =>
      p.category?.toLowerCase() === "shapewear" ||
      /shaper|shapewear|suit|cincher|belt/i.test(p.name),
  );
  const nightList = products.filter(
    (p) =>
      p.category?.toLowerCase() === "nightwear" ||
      /night|robe|pyjama|silk|satin/i.test(p.name),
  );
  const padList = products.filter(
    (p) =>
      p.category?.toLowerCase() === "sanitary pads" ||
      /pad|liner|period/i.test(p.name),
  );
  const matList = products.filter(
    (p) =>
      p.category?.toLowerCase() === "maternity" ||
      /maternity|nursing/i.test(p.name),
  );
  const plusList = products.filter(
    (p) =>
      p.category?.toLowerCase() === "plus size" || /plus/i.test(p.name),
  );
  const bestList = products.filter((p) => p.bestsellere || p.price > 1600);

  return [
    define("all", "All Products", "Every KAYFIY style in one place.", products),
    define(
      "New Arrivals",
      "New Arrivals",
      "Just landed — the newest KAYFIY styles.",
      products.filter((p) => p.new).length > 0
        ? products.filter((p) => p.new)
        : products.slice(0, 12),
    ),
    define(
      "Top Selling",
      "Top Selling",
      "What KAYFIY customers reorder most.",
      bestList.length > 0 ? bestList : products.slice(0, 10),
    ),
    define("Sale", "Sale", "Reduced while stock lasts.", sale.length > 0 ? sale : products.slice(0, 8)),
    define(
      "Budget Deals",
      "Budget Deals",
      "Everyday essentials under Rs. 1,500.",
      budget.length > 0 ? budget : products.slice(0, 8),
    ),
    define(
      "Bras",
      "Bras",
      "Padded, non-padded, wired and sports.",
      brasList.length > 0 ? brasList : products,
    ),
    define(
      "Bra Sets",
      "Bra Sets",
      "Matched bra and brief sets.",
      braSetsList.length > 0 ? braSetsList : products,
    ),
    define(
      "Panties",
      "Panties",
      "Cotton, seamless and lace briefs.",
      pantiesList.length > 0 ? pantiesList : products,
    ),
    define(
      "Shapewear",
      "Shapewear",
      "Smoothing suits, briefs and belts.",
      shapeList.length > 0 ? shapeList : products,
    ),
    define(
      "Nightwear",
      "Nightwear",
      "Sleep and lounge, everyday to bridal.",
      nightList.length > 0 ? nightList : products,
    ),
    define(
      "Sanitary Pads",
      "Sanitary Pads",
      "Period care, gently priced.",
      padList.length > 0 ? padList : products,
    ),
    define(
      "Maternity",
      "Maternity",
      "Nursing bras and post-partum support.",
      matList.length > 0 ? matList : products,
    ),
    define(
      "Plus Size",
      "Plus Size",
      "Full support in extended sizing.",
      plusList.length > 0 ? plusList : products,
    ),

    // Sub collections
    define(
      "Bras Padded",
      "Padded Bras",
      "Lightly to fully padded cups.",
      refine(brasList, /padded/i, /non-padded/i),
      braParent,
    ),
    define(
      "Bras Non-Padded",
      "Non-Padded Bras",
      "Unlined comfort, all-day breathable.",
      refine(brasList, /non-padded/i),
      braParent,
    ),
    define(
      "Bras Sports",
      "Sports Bras",
      "High and medium impact support.",
      refine(brasList, /sports|active/i),
      braParent,
    ),
    define(
      "Bras Wired",
      "Wired Bras",
      "Underwired shaping and lift.",
      refine(brasList, /wired/i),
      braParent,
    ),
    define(
      "Bras Camisoles",
      "Camisoles",
      "Camisole bras and slip tops.",
      refine(brasList, /camisole/i),
      braParent,
    ),
    define(
      "Bras Bralettes",
      "Bralettes",
      "Wire-free, soft-cup bralettes.",
      refine(brasList, /bralette/i),
      braParent,
    ),
    define("Bras Sets", "Bra Sets", "Bra and brief sets.", braSetsList, braParent),
    define(
      "Bras Teens",
      "Teens",
      "First bras and starter styles.",
      refine(brasList, /teen|starter/i),
      braParent,
    ),
    define(
      "Bras T-Shirt Bras",
      "T-Shirt Bras",
      "Seamless under close-fitting tops.",
      refine(brasList, /t-shirt|seamless/i),
      braParent,
    ),
    define(
      "Bras Push-Up",
      "Push-Up Bras",
      "Added lift and shaping.",
      refine(brasList, /push-up/i),
      braParent,
    ),
    define(
      "Bras Accessories",
      "Bra Accessories",
      "Extenders, straps and cups.",
      brasList.slice(0, 6),
      braParent,
    ),

    // Panties
    define("Panties All", "All Panties", "Every brief we make.", pantiesList, pantyParent),
    define(
      "Panties Cotton Briefs",
      "Cotton Briefs",
      "Breathable everyday cotton.",
      refine(pantiesList, /cotton/i),
      pantyParent,
    ),
    define(
      "Panties Fashion Briefs",
      "Fashion Briefs",
      "Lace, mesh and ribbed styles.",
      refine(pantiesList, /lace|ribbed|modal|thong/i),
      pantyParent,
    ),
    define(
      "Panties Maternity Briefs",
      "Maternity Briefs",
      "Gentle support through pregnancy.",
      refine(pantiesList, /maternity|high-waist/i),
      pantyParent,
    ),

    // Nightwear
    define("Nightwear All", "All Nightwear", "Sleep and lounge in full.", nightList, nightParent),
    define(
      "Nightwear Bridal",
      "Bridal Nightwear",
      "Satin and lace for the trousseau.",
      refine(nightList, /bridal|satin|lace/i),
      nightParent,
    ),
    define(
      "Nightwear Tops & Pyjama Set",
      "Tops & Pyjama Sets",
      "Two-piece sets for every season.",
      refine(nightList, /pyjama|set|lounge/i),
      nightParent,
    ),
    define(
      "Nightwear Silk",
      "Silk Nightwear",
      "Silk and silk-blend sleepwear.",
      refine(nightList, /silk/i),
      nightParent,
    ),
    define(
      "Nightwear Winter",
      "Winter Nightwear",
      "Fleece and full-sleeve warmth.",
      refine(nightList, /winter|fleece/i),
      nightParent,
    ),

    // Shapewear
    define("Shapewear All", "All Shapewear", "The full shaping range.", shapeList, shapeParent),
    define(
      "Shapewear Body Suit",
      "Body Suits",
      "Full-body smoothing suits.",
      refine(shapeList, /body suit|body shaper|slip/i),
      shapeParent,
    ),
    define(
      "Shapewear Thigh Shapers",
      "Thigh Shapers",
      "Shorts that stop chafing.",
      refine(shapeList, /thigh|short/i),
      shapeParent,
    ),
    define(
      "Shapewear Shaping Briefs",
      "Shaping Briefs",
      "High-waist tummy control.",
      refine(shapeList, /brief/i),
      shapeParent,
    ),
    define(
      "Shapewear Belts",
      "Shaping Belts",
      "Waist and post-partum belts.",
      refine(shapeList, /belt/i),
      shapeParent,
    ),

    // Maternity
    define(
      "Maternity Nursing Pads",
      "Nursing Pads",
      "Disposable and washable pads.",
      refine(matList, /pad/i),
      matParent,
    ),
    define(
      "Maternity Nursing Bras",
      "Nursing Bras",
      "Easy-open cups, soft support.",
      refine(matList, /nursing bra/i),
      matParent,
    ),
  ];
}

const staticCollectionsList = buildCollections(allProducts);
export const collections = new Map(staticCollectionsList.map((entry) => [entry.slug, entry]));
export const collectionSlugs = staticCollectionsList.map((entry) => entry.slug);

export const getCollection = (collectionSlug: string) =>
  collections.get(collectionSlug);

export function buildSpecialCollections(products: Product[]): Collection[] {
  const sale = products.filter((p) => p.compareAt || p.bestsellere);
  const budget = products.filter((p) => p.price <= 1500);
  const bestList = products.filter((p) => p.bestsellere || p.price > 1600);
  const newList = products.filter((p) => p.new);

  return [
    define("all", "All Products", "Every KAYFIY style in one place.", products),
    define(
      "new-arrivals",
      "New Arrivals",
      "Just landed — the newest KAYFIY styles.",
      newList.length > 0 ? newList : products.slice(0, 12),
    ),
    define(
      "top-selling",
      "Top Selling",
      "What KAYFIY customers reorder most.",
      bestList.length > 0 ? bestList : products.slice(0, 10),
    ),
    define("sale", "Sale", "Reduced while stock lasts.", sale.length > 0 ? sale : products.slice(0, 8)),
    define(
      "budget-deals",
      "Budget Deals",
      "Everyday essentials under Rs. 1,500.",
      budget.length > 0 ? budget : products.slice(0, 8),
    ),
  ];
}

export async function getLiveCollection(
  collectionSlug: string,
): Promise<Collection | undefined> {
  const products = await getLiveProducts();
  const cleanSlug = collectionSlug.trim().toLowerCase();

  // 1. Check Supabase active categories first (admin hierarchy authority)
  try {
    const dbCats = await fetchDbCategories();
    const activeCats = dbCats.filter((c) => c.status === "Active" || !c.status);
    const cat = activeCats.find(
      (c) => c.slug.toLowerCase() === cleanSlug || slug(c.name) === cleanSlug,
    );
    if (cat) {
      let catProducts: Product[] = [];
      let parentInfo: { slug: string; title: string } | undefined = undefined;
      let subcategories: { slug: string; title: string }[] = [];

      if (cat.parent_slug) {
        // It's a subcategory!
        const parentCat = activeCats.find(
          (c) => c.slug.toLowerCase() === cat.parent_slug?.toLowerCase()
        );
        if (parentCat) {
          parentInfo = { slug: parentCat.slug, title: parentCat.name };
        }

        const subSlug = cat.slug.toLowerCase();
        const subName = cat.name.toLowerCase();

        // Match products belonging strictly to this subcategory
        catProducts = products.filter((p) => {
          const pSub = (p.subcategory || "").toLowerCase();
          const pCat = (p.category || "").toLowerCase();
          return (
            pSub === subSlug ||
            slug(pSub) === subSlug ||
            pSub === subName ||
            pCat === subName ||
            slug(pCat) === subSlug
          );
        });
      } else {
        // It's a top-level / main category!
        const children = activeCats
          .filter((c) => (c.parent_slug || "").toLowerCase() === cat.slug.toLowerCase())
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        subcategories = children.map((c) => ({ slug: c.slug, title: c.name }));

        const childSlugs = new Set(children.map((c) => c.slug.toLowerCase()));
        const childNames = new Set(children.map((c) => c.name.toLowerCase()));
        const catName = cat.name.toLowerCase();
        const catSlug = cat.slug.toLowerCase();

        // Match products in this main category OR any of its active subcategories
        catProducts = products.filter((p) => {
          const pCat = (p.category || "").toLowerCase();
          const pSub = (p.subcategory || "").toLowerCase();

          // Direct category match
          if (pCat === catName || slug(pCat) === catSlug) return true;

          // Product subcategory belongs to this main category
          if (pSub && (childSlugs.has(pSub) || childNames.has(pSub) || childSlugs.has(slug(pSub)))) return true;

          return false;
        });
      }

      return {
        slug: cat.slug,
        title: cat.name,
        blurb: cat.description || `Browse our ${cat.name} collection.`,
        products: catProducts,
        parent: parentInfo,
        subcategories: subcategories.length > 0 ? subcategories : undefined,
      };
    }
  } catch (err) {
    console.warn("Error fetching dynamic category:", err);
  }

  // 2. Special system collections (all, new-arrivals, top-selling, sale, budget-deals)
  const specialCollections = buildSpecialCollections(products);
  const matchedSpecial = specialCollections.find((entry) => entry.slug === cleanSlug);
  if (matchedSpecial) return matchedSpecial;

  return undefined;
}

/** Products from the same family, used for "You may also like". */
export const relatedTo = (product: Product, pool: Product[] = allProducts, limit = 4) => {
  const family = product.category || product.id.split("-")[0];
  const same = pool.filter(
    (item) =>
      (item.category === product.category || item.id.startsWith(`${family}-`)) &&
      item.id !== product.id,
  );
  const candidates = same.length >= limit ? same : pool.filter((item) => item.id !== product.id);
  return candidates.slice(0, limit);
};
