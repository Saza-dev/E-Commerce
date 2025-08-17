"use client";

import type { SlugCategory } from "@/src/lib/api/categories";
import ProductRow from "./ProductsRow";

export default function ProductsTable({
  categories,
}: {
  categories: SlugCategory[];
}) {
  return (
    <div>
      {categories.map((products) => (
        <ProductRow products={products} key={products.id} />
      ))}
    </div>
  );
}
