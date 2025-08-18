import type { Product } from "@/src/lib/api/products";
import Link from "next/link";

export default function ProductRow({ product }: { product: Product }) {
  return (
    <Link className="m-10" href={`/product/${product.slug}`}>
      {JSON.stringify(product)}
    </Link>
  );
}
