import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Nothing in this collection just yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
