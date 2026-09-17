import { StarIcon } from "./Icons";
import type { Review } from "@/lib/reviews";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex gap-0.5 text-[#B08D4F]">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < review.rating} className="h-4 w-4" />
        ))}
      </div>
      {review.title && (
        <p className="mt-3 text-sm font-semibold text-charcoal">{review.title}</p>
      )}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{review.body}</p>
      <p className="mt-4 text-xs font-semibold tracking-wider text-charcoal uppercase">
        {review.authorName}
      </p>
    </div>
  );
}
