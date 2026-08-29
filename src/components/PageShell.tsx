import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="transition hover:text-rose">
            Home
          </Link>
        </li>
        {trail.map((crumb) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            {crumb.href ? (
              <Link href={crumb.href} className="transition hover:text-rose">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-charcoal">{crumb.label}</span>
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
    <header className="border-b border-line bg-blush/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <Breadcrumbs trail={trail} />
        <h1 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">
          {title}
        </h1>
        {blurb && <p className="mt-3 max-w-2xl text-sm text-muted">{blurb}</p>}
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
