import type { Product } from "@/src/lib/api/products";
import Link from "next/link";

export default function AdminProductsRow({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: (user: Product) => void;
}) {
  return (
    <tr>
      <td className="py-3 p-3">
        <div className="font-medium">{product.id}</div>
      </td>
      <td className="py-3 p-3">
        <div className="font-medium">{product.name}</div>
      </td>
      <td className="py-3 p-3">
        <div className="font-medium">{product.slug}</div>
      </td>
      <td className="py-3 p-3">
        <div className="font-medium">{product.variants.length}</div>
      </td>

      <td className="py-3 text-right space-x-3">
        <Link
          href={`/admin/products/edit-product/${product.slug}`}
          className="text-sm underline"
        >
          Edit
        </Link>
        <button
          className="text-sm text-red-600 underline"
          onClick={() => onDelete(product)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
