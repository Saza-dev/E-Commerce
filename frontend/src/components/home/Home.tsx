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
import ProductsTable from "../product/ProductsTable";
import { useRouter } from "next/navigation";

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

  const [search, setSearch] = useState("");
  const router = useRouter();

  // handle product search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <main className="p-4 text-black text-[20px] space-y-6">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

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
