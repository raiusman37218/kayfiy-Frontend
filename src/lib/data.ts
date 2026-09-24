import {
  BRA_IMAGES,
  MIXED_IMAGES,
  NIGHTWEAR_IMAGES,
  PANTY_IMAGES,
  SET_IMAGES,
  SHAPEWEAR_IMAGES,
} from "./images";

export type Product = {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  seed: number;
  image: string;
  hoverImage: string;
  images?: string[];
  description?: string;
  category?: string;
  subcategory?: string;
  collection?: string;
  status?: string;
  sizes?: string[];
  colors?: string[];
  instock?: boolean;
  bestsellere?: boolean;
  new?: boolean;
  articleNumber?: string;
  stockQuantity?: number;
  /** Optional — populated from Supabase when set; the filter sidebar only shows a Fabric filter when present. */
  fabric?: string;
};

export type NavLink = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  mega?: boolean;
  children?: NavLink[];
};

export const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const collection = (value: string) => `/collections/${slug(value)}`;

const braSubCategories = [
  "Padded",
  "Non-Padded",
  "Sports",
  "Wired",
  "Camisoles",
  "Bralettes",
  "Sets",
  "Teens",
  "T-Shirt Bras",
  "Push-Up",
  "Accessories",
];

export const navigation: NavItem[] = [
  { label: "Bras", href: collection("Bras") },
  { label: "Pj Sets", href: collection("Pj Sets") },
];

export const announcements = [
  "Welcome to KAYFIY — Comfort Wear Redefined",
  "Up to 50% off + free delivery nationwide over Rs. 3,500",
  "Wire-free & lightly padded comfort — sizes 30A to 44DD",
];

export const heroSlides = [
  {
    id: "comfort",
    eyebrow: "Pure Comfort",
    title: "KAYFIY Comfort Wear",
    caption: "Breathable fabrics and soft support designed for everyday ease.",
    cta: "Shop The Collection",
    href: collection("New Arrivals"),
    image: "/banners/hero-monsoon.jpg",
  },
  {
    id: "sale",
    eyebrow: "Limited Time",
    title: "Comfort Season Sale",
    caption: "Up to 50% off bras, matching sets and nightwear.",
    cta: "Shop the Sale",
    href: collection("Sale"),
    image: "/banners/hero-sale.jpg",
  },
  {
    id: "fit",
    eyebrow: "Fit First",
    title: "Support You Forget You Are Wearing",
    caption: "Wire-free and wired styles, sizes 30A to 44DD.",
    cta: "Shop Bras",
    href: collection("Bras"),
    image: "/banners/hero-fit.jpg",
  },
  {
    id: "budget",
    eyebrow: "Everyday Value",
    title: "Essentials Under Rs. 1,500",
    caption: "Stock up on the basics you reach for daily.",
    cta: "Shop Budget Deals",
    href: collection("Budget Deals"),
    image: "/banners/hero-budget.jpg",
  },
];

export const heroBanners = [
  {
    label: "New Arrivals",
    caption: "Fresh in this week",
    href: collection("New Arrivals"),
    image: BRA_IMAGES[0],
  },
  {
    label: "Top Selling",
    caption: "Loved by 40,000+ women",
    href: collection("Top Selling"),
    image: SET_IMAGES[0],
  },
  {
    label: "Sale — Up to 50% Off",
    caption: "Limited stock",
    href: collection("Sale"),
    image: NIGHTWEAR_IMAGES[0],
  },
  {
    label: "Budget Deals",
    caption: "Everyday essentials under Rs. 1,500",
    href: collection("Budget Deals"),
    image: PANTY_IMAGES[0],
  },
];

const make = (
  prefix: string,
  images: string[],
  rows: [name: string, price: number, compareAt: number | null][],
): Product[] =>
  rows.map(([name, price, compareAt], index) => ({
    id: `${prefix}-${index + 1}`,
    name,
    price,
    compareAt: compareAt ?? undefined,
    seed: index + prefix.length,
    image: images[index % images.length],
    hoverImage: images[(index + 1) % images.length],
  }));

export const bestSellers = make("best", MIXED_IMAGES, [
  ["Noor Everyday Padded Bra", 1690, 2390],
  ["Sana Seamless T-Shirt Bra", 1890, 2590],
  ["Meher Cotton Non-Padded Bra", 1290, null],
  ["Zoya Lace Bralette", 1490, 2190],
  ["Areej Full Coverage Bra", 1790, 2490],
  ["Hina Active Sports Bra", 2090, 2790],
  ["Laiba Soft Push-Up Bra", 1990, null],
  ["Amal Cotton Brief 3-Pack", 1190, 1690],
  ["Rida Smoothing Body Suit", 3290, 4290],
  ["Sahar Silk Nightwear Set", 3890, 4990],
]);

export const bras = make("bra", BRA_IMAGES, [
  ["Noor Everyday Padded Bra", 1690, 2390],
  ["Sana Seamless T-Shirt Bra", 1890, 2590],
  ["Meher Cotton Non-Padded Bra", 1290, null],
  ["Areej Full Coverage Wired Bra", 1790, 2490],
  ["Hina Active Sports Bra", 2090, 2790],
  ["Zoya Lace Bralette", 1490, 2190],
  ["Laiba Soft Push-Up Bra", 1990, null],
  ["Iqra Teen Starter Bra", 990, 1390],
  ["Mahnoor Camisole Bra", 1590, null],
  ["Fajr Plus Size Comfort Bra", 2290, 2990],
]);

export const braSets = make("set", SET_IMAGES, [
  ["Gulnar Lace Bra & Brief Set", 2790, 3690],
  ["Sanam Cotton Comfort Set", 2290, 2990],
  ["Anaya Bridal Satin Set", 4290, 5490],
  ["Rania Everyday Nude Set", 2490, null],
  ["Neelam Mesh Detail Set", 2990, 3890],
  ["Aiza Seamless Duo Set", 2690, 3390],
  ["Zainab Ribbed Knit Set", 2390, null],
  ["Wardah Embroidered Set", 3290, 4190],
  ["Kiran Sports Bra & Brief Set", 2890, 3590],
  ["Hooriya Plus Size Set", 3090, 3890],
]);

export const shapewear = make("shape", SHAPEWEAR_IMAGES, [
  ["Rida Smoothing Body Suit", 3290, 4290],
  ["Ayesha Thigh Shaper Shorts", 2190, 2890],
  ["Bushra High-Waist Shaping Brief", 1890, 2490],
  ["Saba Waist Shaping Belt", 1690, null],
  ["Marium Tummy Control Slip", 3490, 4390],
  ["Nida Seamless Shaping Camisole", 2590, 3290],
  ["Farah Post-Partum Belt", 2290, 2990],
  ["Komal Full Body Shaper", 3890, 4890],
]);

export const panties = make("panty", PANTY_IMAGES, [
  ["Amal Cotton Brief 3-Pack", 1190, 1690],
  ["Sadia Seamless Hipster", 690, null],
  ["Mehak Lace Fashion Brief", 890, 1290],
  ["Nimra High-Waist Cotton Brief", 790, 1090],
  ["Aleena Maternity Brief", 990, 1390],
  ["Hafsa Everyday Bikini Brief", 650, null],
  ["Rabia Modal Boyshort", 950, 1350],
  ["Zunaira Period Brief", 1290, 1790],
  ["Eman Plus Size Cotton Brief", 1090, 1490],
  ["Warda Ribbed Thong 2-Pack", 890, 1190],
]);

export const nightwear = make("night", NIGHTWEAR_IMAGES, [
  ["Sahar Silk Nightwear Set", 3890, 4990],
  ["Durre Bridal Satin Robe", 5490, 6990],
  ["Ifra Cotton Tops & Pyjama Set", 2690, 3390],
  ["Zohra Winter Fleece Set", 3190, 3990],
  ["Naila Sleeveless Night Slip", 2190, 2790],
  ["Shahida Printed Lounge Set", 2490, null],
  ["Ambreen Silk Camisole Shorts", 2990, 3790],
  ["Rukhsar Bridal Lace Gown", 6290, 7990],
]);

export const sanitaryPads = make("pad", PANTY_IMAGES, [
  ["Lisset Daily Liners — 30 Pack", 390, 490],
  ["Lisset Regular Flow Pads — 10 Pack", 290, null],
  ["Lisset Heavy Flow Pads — 10 Pack", 340, 420],
  ["Lisset Overnight Pads — 8 Pack", 380, 460],
  ["Lisset Cotton Soft Pads — 20 Pack", 590, 740],
  ["Lisset Period Care Starter Box", 990, 1290],
]);

export const maternity = make("mat", BRA_IMAGES, [
  ["Sumbal Nursing Bra", 2190, 2790],
  ["Hooria Seamless Nursing Bra", 2490, 3190],
  ["Lisset Disposable Nursing Pads — 30 Pack", 590, 790],
  ["Lisset Washable Nursing Pads — 6 Pack", 890, 1190],
  ["Aleena Maternity Brief", 990, 1390],
  ["Farah Post-Partum Belt", 2290, 2990],
]);

export const plusSize = make("plus", SET_IMAGES, [
  ["Fajr Plus Size Comfort Bra", 2290, 2990],
  ["Hooriya Plus Size Set", 3090, 3890],
  ["Eman Plus Size Cotton Brief", 1090, 1490],
  ["Komal Full Body Shaper", 3890, 4890],
  ["Shazia Wide Strap Support Bra", 2590, 3290],
  ["Tehmina Plus Size Camisole", 1990, 2490],
  ["Nusrat Plus Size Night Set", 3490, 4290],
  ["Rimsha Plus Size Shaping Brief", 2090, 2690],
]);

export const footerCategories: NavLink[] = navigation.map(
  ({ label, href }) => ({ label, href }),
);

export const usefulLinks: NavLink[] = [
  { label: "About Us", href: "/pages/about" },
  { label: "Contact", href: "/pages/contact" },
  { label: "How to Wear a Bra", href: "/pages/how-to-wear-a-bra" },
  { label: "Shipping & Return", href: "/pages/shipping-and-return" },
  { label: "Size Guide", href: "/pages/size-guide" },
  { label: "FAQ", href: "/pages/faq" },
  { label: "Terms of Service", href: "/pages/terms-of-service" },
  { label: "Refund Policy", href: "/pages/refund-policy" },
  { label: "Privacy Policy", href: "/pages/privacy-policy" },
];

export const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString("en-PK")}`;

export const discountPercent = (price: number, compareAt: number) =>
  Math.round(((compareAt - price) / compareAt) * 100);
