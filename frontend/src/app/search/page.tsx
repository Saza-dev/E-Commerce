import Filters from "@/src/components/product/Filters";
import ProductsTable from "@/src/components/product/ProductsTable";
import { listProducts, type Product } from "@/src/lib/api/products";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { q, min, max, sort } = await searchParams;
  const searchQuery = q ? q.toLowerCase() : "";
  const minPrice = min ? parseFloat(min) : 0;
  const maxPrice = max ? parseFloat(max) : Infinity;

  type ProductWithCategory = Product & {
    category?: { id: number; name: string; slug?: string; parentId?: number };
  };

  const products: ProductWithCategory[] = await listProducts();

  // filter
  const filtered = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchQuery);
    const matchesPrice =
      (p.variants?.[0]?.price ?? 0) >= minPrice &&
      (p.variants?.[0]?.price ?? 0) <= maxPrice;

    return matchesName && matchesPrice;
  });

  // sorting
  if (sort === "price-asc") {
    filtered.sort(
      (a, b) => (a.variants?.[0]?.price ?? 0) - (b.variants?.[0]?.price ?? 0)
    );
  } else if (sort === "price-desc") {
    filtered.sort(
      (a, b) => (b.variants?.[0]?.price ?? 0) - (a.variants?.[0]?.price ?? 0)
    );
  } else if (sort === "date-asc") {
    filtered.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  } else if (sort === "date-desc") {
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">
        Search results for:{" "}
        <span className="text-blue-600">{q || "All Products"}</span>
      </h1>

      <Filters />

      <ProductsTable categories={filtered} />
    </div>
  );
}
