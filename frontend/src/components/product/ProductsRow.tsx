import type { Product } from "@/src/lib/api/products";
import Link from "next/link";

export default function ProductRow({
  product,
}: {
  product: Product
}) {
  return (
    <Link className="m-5 flex w-[1200px] border p-5" href={`/product/${product.slug}`}>
      <div className="w-[200px]">
        <img
          key={product.id}
          src={product.variants?.[0]?.images?.[0]?.url ?? "/placeholder.png"}
          alt={product.variants?.[0]?.color ?? "No color"}
          width={100}
          height={100}
        />
      </div>
      <div className="flex-1">
        <div>{product.name}</div>
        <div>{product.description}</div>
      </div>

      <div>
        {" "}
        <div>{product.variants?.[0]?.size}</div>
        <div>{product.variants?.[0]?.price}</div>
      </div>
    </Link>
  );
}
