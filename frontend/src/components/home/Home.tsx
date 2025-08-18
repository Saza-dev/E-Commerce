"use client";

import {
  Category,
  listCategoriesUsers,
  listCategoryProductsBySlug,
} from "@/src/lib/api/categories";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryItem from "./CategoryItem";
import { listProducts, type Product } from "@/src/lib/api/products";
import ProductsTable from "./ProductsTable";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [Products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Load all categories first
  useEffect(() => {
    (async () => {
      try {
        const data = await listCategoriesUsers();
        const products = await listProducts();
        setCategories(data);
        setProducts(products);
      } catch {
        toast.error("Failed to load categories");
      }
    })();
  }, []);

  // Load products of a category when button is clicked
  const handleCategoryClick = async (slug: string) => {
    setLoading(true);
    try {
      const data = await listCategoryProductsBySlug(slug);
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 text-black text-[20px] space-y-6">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            onClick={handleCategoryClick}
            category={cat}
          />
        ))}
      </div>

      {/* Products Section */}
      <div>
        {loading ? (
          <p>Loading products...</p>
        ) : Products ? (
          <div>
            {Products.length > 0 ? (
              <ProductsTable categories={Products} />
            ) : (
              <p>No products found.</p>
            )}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </main>
  );
}
