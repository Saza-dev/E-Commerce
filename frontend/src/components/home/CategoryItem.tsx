import type { Category } from "@/src/lib/api/categories";
import Button from "../ui/button";

type CategoryProps = {
  category: Category;
  onClick?: (slug: string) => void;
};

export default function CategoryItem({ category, onClick }: CategoryProps) {
  return (
    <div className="ml-4">
      <Button onClick={() => onClick?.(category.slug)}>{category.name}</Button>
      {category.children && category.children.length > 0 && (
        <div className="ml-6 border-l pl-2">
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  );
}
