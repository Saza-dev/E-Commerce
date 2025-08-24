"use client";

import { useState } from "react";
import type { Category } from "@/src/lib/api/categories";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";

type CategoryProps = {
  category: Category;
  onClick?: (slug: string) => void;
  defaultOpen?: boolean;
};

export default function CategoryItem({
  category,
  onClick,
  defaultOpen,
}: CategoryProps) {
  const [open, setOpen] = useState(defaultOpen);

  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div className="flex bg-white rounded-[10px] shadow-blue-200 shadow w-[320px] h-[50px]">
        <button className="w-[250px]" onClick={() => onClick?.(category.slug)}>
          {category.name}
        </button>

        {/* Only show toggle if there are subcategories */}
        {hasChildren && (
          <button onClick={() => setOpen(!open)} className="px-2 py-1 text-[16px]">
            {open ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
          </button>
        )}
      </div>

      {/* Show subcategories only when open */}
      {open && hasChildren && (
        <div className="ml-6 mt-2 flex flex-col gap-2">
          {category.children?.map((child) => (
            <CategoryItem key={child.id} category={child} onClick={onClick} />
          ))}
        </div>
      )}
    </div>
  );
}
