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
import { FaArrowRightLong } from "react-icons/fa6";
import Button from "../ui/button";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [Products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
      setOpen(false); // auto close when category selected
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
    <main className="p-4 text-black text-[20px] flex flex-col  items-center space-y-6">
      <div className="flex justify-between w-[1400px]">
        {/* Category Buttons */}
        <div>
          {/* Trigger button */}

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            Categories <FaArrowRightLong />
          </button>

          {/* Overlay */}
          {open && (
            <div
              className="fixed inset-0  bg-opacity-50 z-40"
              onClick={() => setOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-[500px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Close button */}
            <div className="flex justify-between items-center p-10">
              <h2 className="text-[30px] font-semibold">Categories </h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Category list */}
            <div className="ml-10">
              {categories.map((cat, index) => (
                <CategoryItem
                  key={cat.id}
                  onClick={handleCategoryClick}
                  category={cat}
                  defaultOpen={index < 1}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="rounded-lg border border-gray-300 w-[300px] pl-4 p-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
          <Button type="submit" className="h-[46px]">Search</Button>
        </form>
      </div>

      {/* Products Section */}
      <div className="w-full flex justify-center">
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
