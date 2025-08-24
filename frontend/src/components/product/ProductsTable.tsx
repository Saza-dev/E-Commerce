"use client";

import { useMemo, useState } from "react";
import ProductRow from "./ProductsRow";
import type { Product } from "@/src/lib/api/products";
import Button from "../ui/button";

export default function ProductsTable({
  categories,
}: {
  categories: Product[];
}) {
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 10,
  });



  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(categories.length / (query.pageSize || 10))),
    [categories.length, query.pageSize]
  );

  const paginatedProducts = useMemo(() => {
    const start = (query.page - 1) * query.pageSize;
    const end = start + query.pageSize;
    return categories.slice(start, end);
  }, [categories, query.page, query.pageSize]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-3">
        {paginatedProducts.map((product) => (
          <ProductRow product={product} key={product.id} />
        ))}
      </div>

      <div className="mt-4 flex items-center  justify-between w-[1200px]">
        <div className="text-sm text-gray-600">
          Total: {categories.length} • Page {query.page} / {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setQuery((q) => ({ ...q, page: 1 }))}
            disabled={(query.page || 1) === 1}
          >
            First
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              setQuery((q) => ({ ...q, page: Math.max(1, (q.page || 1) - 1) }))
            }
            disabled={(query.page || 1) === 1}
          >
            Prev
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              setQuery((q) => ({
                ...q,
                page: Math.min(totalPages, (q.page || 1) + 1),
              }))
            }
            disabled={(query.page || 1) >= totalPages}
          >
            Next
          </Button>
          <Button
            variant="ghost"
            onClick={() => setQuery((q) => ({ ...q, page: totalPages }))}
            disabled={(query.page || 1) >= totalPages}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
