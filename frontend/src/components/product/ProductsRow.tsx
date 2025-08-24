import type { Product } from "@/src/lib/api/products";
import Link from "next/link";

export default function ProductRow({ product }: { product: Product }) {
  const uniqueColors = [...new Set(product?.variants?.map((v) => v.color))];
  const uniqueSizes = [
    ...new Set(product?.variants?.filter((v) => v.color).map((v) => v.size)),
  ];

  return (
    <Link
      className="m-5 flex flex-col w-[400px] h-[500px] border p-5"
      href={`/product/${product.slug}`}
    >
      <div className="w-full h-[320px] flex items-center justify-center">
        <img
          key={product.id}
          src={product.variants?.[0]?.images?.[0]?.url ?? "/placeholder.png"}
          alt={product.variants?.[0]?.color ?? "No color"}
          width={280}
          height={200}
        />
      </div>
      <div className="mt-5 flex items-center flex-col gap-2">
        <div className="font-[600]">{product.name}</div>
        <div className="flex gap-2 mt-2 text-gray-500">
          {uniqueSizes.map((size) => (
            <span
              key={size}
              className="px-3 py-1 border text-[12px] rounded-md font-medium bg-gray-100"
            >
              {size}
            </span>
          ))}
        </div>
        <div className="text-gray-500 text-[12px]">{uniqueColors.length} Colors</div>
        <div className="text-[14px] font-[700]"> LKR {product.variants?.[0]?.price}</div>
      </div>
    </Link>
  );
}
