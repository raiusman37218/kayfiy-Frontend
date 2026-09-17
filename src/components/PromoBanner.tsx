import Image from "next/image";
import Link from "next/link";
import type { BannerProp } from "@/lib/images";
import { ArrowIcon } from "./Icons";

type Props = {
  banner: BannerProp;
  title?: string;
  badge?: string;
  subtitle?: string;
  ctaText?: string;
  href?: string;
  aspectRatio?: string;
  className?: string;
};

export default function PromoBanner({
  banner,
  title,
  badge,
  subtitle,
  ctaText = "Shop Collection",
  href,
  aspectRatio,
  className = "",
}: Props) {
  const desktopSrc = typeof banner === "string" ? banner : banner.desktop;
  const mobileSrc = typeof banner === "string" ? undefined : banner.mobile;
  const altText =
    typeof banner !== "string" && banner.alt
      ? banner.alt
      : title || "Promotional Banner";

  const aspectClasses =
    aspectRatio ||
    (typeof banner !== "string" && banner.aspectRatio
      ? banner.aspectRatio
      : "aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9]");

  const content = (
    <div
      className={`group relative w-full ${aspectClasses} overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm transition-all duration-500 hover:shadow-xl ${className}`}
    >
      {/* Background Images with responsive mobile/desktop handling */}
      {mobileSrc ? (
        <>
          <Image
            src={mobileSrc}
            alt={altText}
            fill
            sizes="(min-width: 768px) 1px, 100vw"
            className="object-cover transition duration-700 group-hover:scale-103 md:hidden"
          />
          <Image
            src={desktopSrc}
            alt={altText}
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="hidden object-cover transition duration-700 group-hover:scale-103 md:block"
          />
        </>
      ) : (
        <Image
          src={desktopSrc}
          alt={altText}
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover transition duration-700 group-hover:scale-103"
        />
      )}

      {/* Optional text overlay if title / badge / subtitle provided */}
      {(title || badge || subtitle || ctaText) && (
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/40 to-transparent flex items-center p-6 sm:p-10 md:p-14">
          <div className="max-w-md text-white">
            {badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {badge}
              </span>
            )}
            {title && (
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                {subtitle}
              </p>
            )}
            {ctaText && (
              <div className="mt-4 sm:mt-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs font-bold tracking-[0.14em] text-charcoal uppercase transition duration-300 group-hover:bg-[#7A2A3D] group-hover:text-white shadow-sm">
                  <span>{ctaText}</span>
                  <ArrowIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {href ? (
        <Link href={href} aria-label={title || altText} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </section>
  );
}
