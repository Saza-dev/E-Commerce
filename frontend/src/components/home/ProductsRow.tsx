import type { SlugCategory } from "@/src/lib/api/categories";

export default function ProductRow({
  products,
}: {
  products: SlugCategory;
}) {
  return <div>{JSON.stringify(products)}</div>;
}
