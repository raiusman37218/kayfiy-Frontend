import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-medium text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="transition hover:text-[#7A2A3D]">
            Home
          </Link>
        </li>
        {trail.map((crumb) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            <svg className="h-3 w-3 text-muted-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {crumb.href ? (
              <Link href={crumb.href} className="transition hover:text-[#7A2A3D]">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-semibold text-charcoal">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  blurb,
  trail,
}: {
  title: string;
  blurb?: string;
  trail: Crumb[];
}) {
  return (
    <header className="border-b border-line bg-gradient-to-br from-blush/50 via-[#FCF0F2]/40 to-cream relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#7A2A3D]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blush-deep/20 blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14 relative">
        <Breadcrumbs trail={trail} />
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl text-charcoal sm:text-5xl font-bold tracking-tight">
          {title}
        </h1>
        {blurb && <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">{blurb}</p>}
      </div>
    </header>
  );
}

/** Narrow reading column used by the policy / help pages. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="space-y-6 text-sm leading-relaxed text-muted [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-charcoal [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-charcoal">
        {children}
      </div>
    </div>
  );
}
