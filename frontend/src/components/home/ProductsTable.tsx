"use client";

import ProductRow from "./ProductsRow";
import type { Product } from "@/src/lib/api/products";

export default function ProductsTable({
  categories,
}: {
  categories: Product[];
}) {
  return (
    <div className="flex flex-col">
      {categories.map((product) => (
        <ProductRow product={product} key={product.id} />
      ))}
    </div>
  );
}
