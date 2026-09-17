import ReviewCard from "./ReviewCard";
import { StarIcon } from "./Icons";
import { averageRating, type Review } from "@/lib/reviews";

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="border-t border-line py-10">
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold tracking-tight text-charcoal">
          Customer Reviews
        </h2>
        <p className="mt-2 text-sm text-muted">
          No reviews yet for this style — be the first to try it.
        </p>
      </div>
    );
  }

  const avg = averageRating(reviews);

  return (
    <div className="border-t border-line py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold tracking-tight text-charcoal">
          Customer Reviews
        </h2>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 text-[#B08D4F]">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} filled={i < Math.round(avg)} className="h-4 w-4" />
            ))}
          </div>
          <span className="text-sm text-muted">
            {avg.toFixed(1)} ({reviews.length} review{reviews.length === 1 ? "" : "s"})
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
