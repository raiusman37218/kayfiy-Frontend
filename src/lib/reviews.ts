import { fetchDbReviews, type DbReview } from "./supabase";

export type Review = {
  id: string;
  productSlug: string | null;
  authorName: string;
  rating: number;
  title?: string;
  body: string;
  isFeatured: boolean;
};

function mapDbReview(row: DbReview): Review {
  return {
    id: row.id,
    productSlug: row.product_slug,
    authorName: row.author_name,
    rating: row.rating,
    title: row.title,
    body: row.body,
    isFeatured: row.is_featured ?? false,
  };
}

/** Static fallback so the reviews/testimonials sections aren't empty before the `reviews` table has real data. */
export const staticReviews: Review[] = [
  {
    id: "seed-1",
    productSlug: "noor-everyday-padded-bra",
    authorName: "Noor A., Lahore",
    rating: 5,
    title: "Finally, a bra that fits",
    body: "Ordered my usual size and it fit perfectly the first time. Soft against the skin, no digging wires. Reordering in two more colors.",
    isFeatured: true,
  },
  {
    id: "seed-2",
    productSlug: "sana-seamless-t-shirt-bra",
    authorName: "Sana K., Karachi",
    rating: 5,
    title: "Wear it every single day",
    body: "Completely invisible under fitted tops and so comfortable I forget I have it on by the afternoon.",
    isFeatured: true,
  },
  {
    id: "seed-3",
    productSlug: "gulnar-lace-bra-and-brief-set",
    authorName: "Rida M., Islamabad",
    rating: 4,
    title: "Beautiful set, true to size",
    body: "The lace detailing looks so much more expensive than the price. Delivery was quick too, about 3 days.",
    isFeatured: true,
  },
  {
    id: "seed-4",
    productSlug: null,
    authorName: "Areej H., Faisalabad",
    rating: 5,
    title: "My go-to for everyday comfort wear now",
    body: "Discreet packaging, cash on delivery, and the quality is honestly better than brands twice the price. Kayfiy has my trust now.",
    isFeatured: true,
  },
  {
    id: "seed-5",
    productSlug: null,
    authorName: "Hina S., Multan",
    rating: 5,
    title: "Customer service actually helped me size right",
    body: "I messaged on WhatsApp unsure of my size and they replied within the hour with exactly what I needed. The bra fit perfectly.",
    isFeatured: true,
  },
  {
    id: "seed-6",
    productSlug: "amal-cotton-brief-3-pack",
    authorName: "Zoya I., Lahore",
    rating: 5,
    body: "Soft cotton, holds up well after washing. Good value for a 3-pack.",
    isFeatured: false,
  },
];

/** Live reviews from Supabase with fallback to the curated static list. */
export async function getLiveReviews(): Promise<Review[]> {
  try {
    const rows = await fetchDbReviews();
    if (rows && rows.length > 0) {
      return rows.map(mapDbReview);
    }
  } catch (error) {
    console.warn("Failed to load reviews from DB, using fallback:", error);
  }
  return staticReviews;
}

export async function getReviewsForProduct(productSlug: string): Promise<Review[]> {
  const all = await getLiveReviews();
  return all.filter((review) => review.productSlug === productSlug);
}

export async function getFeaturedReviews(limit = 6): Promise<Review[]> {
  const all = await getLiveReviews();
  const featured = all.filter((review) => review.isFeatured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export function averageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return (
    reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
  );
}
