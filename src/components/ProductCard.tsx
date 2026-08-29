import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice, slug, type Product } from "@/lib/data";

const SIZES =
  "(min-width: 1280px) 19vw, (min-width: 1024px) 23vw, (min-width: 768px) 30vw, (min-width: 640px) 38vw, 62vw";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = typeof product.compareAt === "number";

  return (
    <article className="group">
      <Link href={`/products/${slug(product.name)}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-blush shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_36px_-20px_rgba(43,39,36,0.45)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={SIZES}
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={product.hoverImage}
            alt=""
            aria-hidden
            fill
            sizes={SIZES}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {onSale && (
            <span className="absolute top-3 left-3 rounded-full bg-rose px-3 py-1 text-[10px] font-medium tracking-[0.14em] text-white uppercase">
              Sale
            </span>
          )}
          {onSale && (
            <span className="absolute top-3 right-3 rounded-full bg-cream/90 px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] text-charcoal">
              -{discountPercent(product.price, product.compareAt!)}%
            </span>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm text-charcoal transition group-hover:text-rose">
          {product.name}
        </h3>

        <p className="mt-1 flex items-baseline gap-2 text-sm">
          {onSale && (
            <span className="text-muted line-through">
              {formatPrice(product.compareAt!)}
            </span>
          )}
          <span className={onSale ? "font-medium text-rose" : "text-charcoal"}>
            {formatPrice(product.price)}
          </span>
        </p>
      </Link>
    </article>
  );
}
