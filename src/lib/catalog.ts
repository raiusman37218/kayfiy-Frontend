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

/** Every product on the site, de-duplicated by slug (several lists share styles). */
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
};

/**
 * Sub-collections filter their parent list by keyword. When a filter is too
 * narrow to fill a page we fall back to the whole parent list rather than
 * shipping an empty grid.
 */
const refine = (parentList: Product[], pattern: RegExp, exclude?: RegExp) => {
  const matched = parentList.filter(
    (product) =>
      pattern.test(product.name) && !(exclude && exclude.test(product.name)),
  );
  return matched.length >= 3 ? matched : parentList;
};

const sale = allProducts.filter((product) => product.compareAt);
const budget = allProducts.filter((product) => product.price <= 1500);

/**
 * `slugSource` must match the label the nav builds its href from, so every
 * link in the header and footer resolves to a real page.
 */
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

const list: Collection[] = [
  define("all", "All Products", "Every Lisset style in one place.", allProducts),
  define("New Arrivals", "New Arrivals", "Just landed — the newest Lisset styles.", allProducts.slice(0, 12)),
  define("Top Selling", "Top Selling", "What Lisset customers reorder most.", bestSellers),
  define("Sale", "Sale", "Reduced while stock lasts.", sale),
  define("Budget Deals", "Budget Deals", "Everyday essentials under Rs. 1,500.", budget),
  define("Bras", "Bras", "Padded, non-padded, wired and sports.", bras),
  define("Bra Sets", "Bra Sets", "Matched bra and brief sets.", braSets),
  define("Panties", "Panties", "Cotton, seamless and lace briefs.", panties),
  define("Shapewear", "Shapewear", "Smoothing suits, briefs and belts.", shapewear),
  define("Nightwear", "Nightwear", "Sleep and lounge, everyday to bridal.", nightwear),
  define("Sanitary Pads", "Sanitary Pads", "Period care, gently priced.", sanitaryPads),
  define("Maternity", "Maternity", "Nursing bras and post-partum support.", maternity),
  define("Plus Size", "Plus Size", "Full support in extended sizing.", plusSize),

  // Bras
  define("Bras Padded", "Padded Bras", "Lightly to fully padded cups.", refine(bras, /padded/i, /non-padded/i), braParent),
  define("Bras Non-Padded", "Non-Padded Bras", "Unlined comfort, all-day breathable.", refine(bras, /non-padded/i), braParent),
  define("Bras Sports", "Sports Bras", "High and medium impact support.", refine(bras, /sports|active/i), braParent),
  define("Bras Wired", "Wired Bras", "Underwired shaping and lift.", refine(bras, /wired/i), braParent),
  define("Bras Camisoles", "Camisoles", "Camisole bras and slip tops.", refine(bras, /camisole/i), braParent),
  define("Bras Bralettes", "Bralettes", "Wire-free, soft-cup bralettes.", refine(bras, /bralette/i), braParent),
  define("Bras Sets", "Bra Sets", "Bra and brief sets.", braSets, braParent),
  define("Bras Teens", "Teens", "First bras and starter styles.", refine(bras, /teen|starter/i), braParent),
  define("Bras T-Shirt Bras", "T-Shirt Bras", "Seamless under close-fitting tops.", refine(bras, /t-shirt|seamless/i), braParent),
  define("Bras Push-Up", "Push-Up Bras", "Added lift and shaping.", refine(bras, /push-up/i), braParent),
  define("Bras Accessories", "Bra Accessories", "Extenders, straps and cups.", bras.slice(0, 6), braParent),

  // Panties
  define("Panties All", "All Panties", "Every brief we make.", panties, pantyParent),
  define("Panties Cotton Briefs", "Cotton Briefs", "Breathable everyday cotton.", refine(panties, /cotton/i), pantyParent),
  define("Panties Fashion Briefs", "Fashion Briefs", "Lace, mesh and ribbed styles.", refine(panties, /lace|ribbed|modal|thong/i), pantyParent),
  define("Panties Maternity Briefs", "Maternity Briefs", "Gentle support through pregnancy.", refine(panties, /maternity|high-waist/i), pantyParent),

  // Nightwear
  define("Nightwear All", "All Nightwear", "Sleep and lounge in full.", nightwear, nightParent),
  define("Nightwear Bridal", "Bridal Nightwear", "Satin and lace for the trousseau.", refine(nightwear, /bridal|satin|lace/i), nightParent),
  define("Nightwear Tops & Pyjama Set", "Tops & Pyjama Sets", "Two-piece sets for every season.", refine(nightwear, /pyjama|set|lounge/i), nightParent),
  define("Nightwear Silk", "Silk Nightwear", "Silk and silk-blend sleepwear.", refine(nightwear, /silk/i), nightParent),
  define("Nightwear Winter", "Winter Nightwear", "Fleece and full-sleeve warmth.", refine(nightwear, /winter|fleece/i), nightParent),

  // Shapewear
  define("Shapewear All", "All Shapewear", "The full shaping range.", shapewear, shapeParent),
  define("Shapewear Body Suit", "Body Suits", "Full-body smoothing suits.", refine(shapewear, /body suit|body shaper|slip/i), shapeParent),
  define("Shapewear Thigh Shapers", "Thigh Shapers", "Shorts that stop chafing.", refine(shapewear, /thigh|short/i), shapeParent),
  define("Shapewear Shaping Briefs", "Shaping Briefs", "High-waist tummy control.", refine(shapewear, /brief/i), shapeParent),
  define("Shapewear Belts", "Shaping Belts", "Waist and post-partum belts.", refine(shapewear, /belt/i), shapeParent),

  // Maternity
  define("Maternity Nursing Pads", "Nursing Pads", "Disposable and washable pads.", refine(maternity, /pad/i), matParent),
  define("Maternity Nursing Bras", "Nursing Bras", "Easy-open cups, soft support.", refine(maternity, /nursing bra/i), matParent),
];

export const collections = new Map(list.map((entry) => [entry.slug, entry]));

export const collectionSlugs = list.map((entry) => entry.slug);

export const getCollection = (collectionSlug: string) =>
  collections.get(collectionSlug);

/** Products from the same family, used for "You may also like". */
export const relatedTo = (product: Product, limit = 5) => {
  const family = product.id.split("-")[0];
  const same = allProducts.filter(
    (item) => item.id.startsWith(`${family}-`) && item.id !== product.id,
  );
  const pool = same.length >= limit ? same : allProducts.filter((item) => item.id !== product.id);
  return pool.slice(0, limit);
};
