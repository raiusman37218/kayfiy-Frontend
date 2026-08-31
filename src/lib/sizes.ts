import { type Product } from "@/lib/data";

export const BRA_SIZES = [
  "32B",
  "34B",
  "34C",
  "36B",
  "36C",
  "38C",
  "40D",
  "42D",
];
export const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
export const ONE_SIZE = ["One size"];

/** The sizes a product is actually sold in. */
export function sizesFor(product: Product) {
  if (
    product.sizes &&
    product.sizes.length > 0 &&
    product.sizes[0] !== "Standard"
  ) {
    return product.sizes;
  }
  // Word boundaries matter here — "Padded Bra" must not read as a pack of pads.
  if (/\bpads?\b|\bliners\b|\bbox\b/i.test(product.name)) return ONE_SIZE;
  if (/belt/i.test(product.name)) return APPAREL_SIZES;
  if (/bra\b|bralette|push-up|t-shirt/i.test(product.name)) return BRA_SIZES;
  return APPAREL_SIZES;
}

/** True when this product is a bra sold in band+cup sizes. */
export function isBraProduct(product: Product) {
  return sizesFor(product).some((size) => /^\d{2}[A-Z]+$/.test(size));
}
