/**
 * Product and banner photography.
 *
 * All files are free-license Unsplash photos downloaded into /public, hand-checked
 * so none of them carry a third-party brand mark. Swap these paths for Lisset's own
 * studio shots when they are ready — nothing else needs to change.
 */

export const BRA_IMAGES = [
  "/images/bra-lace-black.jpg",
  "/images/bra-white-knit.jpg",
  "/images/bras-assorted.jpg",
  "/images/bra-black-satin.jpg",
  "/images/bralette-maroon.jpg",
];

export const SET_IMAGES = [
  "/images/bras-assorted.jpg",
  "/images/bralette-maroon.jpg",
  "/images/bra-lace-black.jpg",
  "/images/camisole-blush-satin.jpg",
  "/images/bra-white-knit.jpg",
];

export const PANTY_IMAGES = [
  "/images/brief-cream-lace.jpg",
  "/images/bras-assorted.jpg",
  "/images/bra-black-satin.jpg",
  "/images/bra-lace-black.jpg",
];

export const SHAPEWEAR_IMAGES = [
  "/images/camisoles-stack.jpg",
  "/images/camisole-blush-satin.jpg",
  "/images/slip-cream.jpg",
  "/images/camisole-black-lace.jpg",
];

export const NIGHTWEAR_IMAGES = [
  "/images/pyjama-pink.jpg",
  "/images/pyjama-blue.jpg",
  "/images/silk-fabrics.jpg",
  "/images/slip-cream.jpg",
];

export const MIXED_IMAGES = [
  "/images/bras-assorted.jpg",
  "/images/bra-lace-black.jpg",
  "/images/camisoles-stack.jpg",
  "/images/brief-cream-lace.jpg",
  "/images/pyjama-pink.jpg",
  "/images/bra-white-knit.jpg",
  "/images/camisole-blush-satin.jpg",
  "/images/bralette-maroon.jpg",
  "/images/slip-cream.jpg",
  "/images/bra-black-satin.jpg",
];

export interface BannerConfig {
  desktop: string;
  mobile?: string;
  alt?: string;
  aspectRatio?: string;
}

export type BannerProp = string | BannerConfig;

export const SECTION_BANNERS: Record<string, BannerConfig> = {
  bestSellers: {
    desktop: "/banners/sec-best-sellers.jpg",
    alt: "Best Sellers collection",
    aspectRatio: "aspect-[8/3]",
  },
  bras: {
    desktop: "/banners/sec-bras.jpg",
    alt: "Bras collection",
    aspectRatio: "aspect-[8/3]",
  },
  braSets: {
    desktop: "/banners/sec-bra-sets.jpg",
    alt: "Bra Sets collection",
    aspectRatio: "aspect-[8/3]",
  },
  shapewear: {
    desktop: "/banners/sec-shapewear.jpg",
    alt: "Shapewear collection",
    aspectRatio: "aspect-[8/3]",
  },
  panties: {
    desktop: "/banners/sec-panties.jpg",
    alt: "Panties collection",
    aspectRatio: "aspect-[8/3]",
  },
};


