"use client";

import clsx from "clsx";
import AdminProductsRow from "./AdminProductsRow";
import { useEffect, useState } from "react";
import {
  deleteProduct,
  listProducts,
  type Product,
} from "@/src/lib/api/products";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminProductsTable() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // loading dataset function
  const load = async () => {
    setLoading(true);
    try {
      const data = await listProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // loading dataset on load
  useEffect(() => {
    load();
  }, []);

  // Product Delete function
  const onDelete = async (product: Product) => {
    if (!confirm(`Delete Product ${product.name}? This cannot be undone.`))
      return;
    try {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      load();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-4 gap-3 flex-wrap">
        <Link href={"/admin/products/add-product"}>Add Product</Link>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : products.length === 0 ? (
        <div className="text-sm text-gray-600">No products found.</div>
      ) : (
        <div className="overflow-auto rounded-xl">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                {[
                  { key: "ProductId", label: "Id" },
                  { key: "ProductName", label: "Name" },
                  { key: "ProductSlug", label: "Slug" },
                  { key: "VariantCount", label: "Variant Count" },
                  {
                    key: "actions",
                    label: "Actions",
                    unsortable: true,
                    align: "right",
                  },
                ].map((col) => {
                  return (
                    <th
                      key={col.key}
                      className={clsx(
                        "p-3 font-medium",
                        col.align === "right" ? "text-right" : "text-left"
                      )}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <AdminProductsRow
                  key={product.id}
                  product={product}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
