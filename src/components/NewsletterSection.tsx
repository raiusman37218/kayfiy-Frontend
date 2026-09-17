import NewsletterForm from "./NewsletterForm";

export default function NewsletterSection() {
  return (
    <section aria-label="Newsletter" className="bg-maroon">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3.5 py-1 text-[10px] font-bold tracking-[0.18em] text-gold-soft uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Stay in touch
        </span>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-cream sm:text-4xl">
          New arrivals, first
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/75">
          Restocks, fit tips and quiet sales — one email a fortnight, never more.
        </p>
        <div className="mx-auto mt-7 max-w-md">
          <NewsletterForm variant="dark" />
        </div>
      </div>
    </section>
  );
}
