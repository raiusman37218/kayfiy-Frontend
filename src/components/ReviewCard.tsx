import { StarIcon } from "./Icons";
import type { Review } from "@/lib/reviews";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-[#B08D4F]">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < review.rating} className="h-4 w-4" />
          ))}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified Buyer
        </span>
      </div>
      {review.title && (
        <p className="mt-3.5 text-sm font-bold text-charcoal">{review.title}</p>
      )}
      <p className="mt-2 flex-1 text-xs sm:text-sm leading-relaxed text-muted">{review.body}</p>
      <div className="mt-4 pt-3 border-t border-line/50 flex items-center justify-between">
        <p className="text-xs font-bold tracking-wider text-charcoal uppercase">
          {review.authorName}
        </p>
      </div>
    </div>
  );
}
