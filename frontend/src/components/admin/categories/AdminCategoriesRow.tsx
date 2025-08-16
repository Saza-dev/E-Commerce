import type { Category } from "@/src/lib/api/categories";
import Button from "../../ui/button";

export default function AdminCategoriesRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category & { parentName?: string | null };
  onEdit: (user: Category) => void;
  onDelete: (user: Category) => void;
}) {
  return (
    <tr>
      <td className="py-3 p-3">
        <div className="font-medium">{category.name}</div>
      </td>
      <td className="py-3 p-3">
        <div className="font-medium">{category.id}</div>
      </td>
      <td className="py-3 px-3">
        {category.parentId ? (
          <div className="font-medium">
            {category.parentId} ({category.parentName ?? "N/A"})
          </div>
        ) : (
          <div className="text-gray-500">No parent</div>
        )}
      </td>

      <td className="py-3 text-right space-x-3">
        <Button className="text-sm underline" onClick={() => onEdit(category)}>
          Edit
        </Button>
        <button
          className="text-sm text-red-600 underline"
          onClick={() => onDelete(category)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
