"use client";

import { listCategoriesAdmin, deleteCategory } from "@/src/lib/api/categories";
import type { Category } from "@/src/lib/api/categories";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminCategoriesRow from "./AdminCategoriesRow";
import CreateCategory from "./CreateCategory";
import Button from "../../ui/button";

type CategoryWithParent = Category & { parentName?: string | null };

export default function AdminCategoriesTable() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Category[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // adding parent name to dataset
  const addParentNames = (categories: Category[]): CategoryWithParent[] => {
    // make a lookup map of id → name
    const map = new Map<number, string>();
    categories.forEach((cat) => {
      map.set(cat.id, cat.name);
    });

    // enrich categories with parentName
    return categories.map((cat) => ({
      ...cat,
      parentName: cat.parentId ? map.get(cat.parentId) ?? null : null,
    }));
  };

  // loading dataset function
  const load = async () => {
    setLoading(true);
    try {
      const data = await listCategoriesAdmin();
      const enriched = addParentNames(data);
      setItems(enriched);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // loading dataset on load
  useEffect(() => {
    load();
  }, []);

  // Category Delete function
  const onDelete = async (category: CategoryWithParent) => {
    if (!confirm(`Delete category ${category.name}? This cannot be undone.`))
      return;
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted");
      load();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  // Editing Category Function

  return (
    <div>
      <div className="flex items-center justify-end mb-4 gap-3 flex-wrap">
        <Button
          onClick={() => {
            setCreateOpen(true);
            setEditingCategory(null);
          }}
        >
          Add Category
        </Button>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">No categories found.</div>
      ) : (
        <div className="overflow-auto rounded-xl">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                {[
                  { key: "CategoryName", label: "Category Name" },
                  { key: "Id", label: "ID" },
                  { key: "ParentId", label: "Parent Id" },
                  {
                    key: "actions",
                    label: "Actions",
                    unsortable: true,
                    align: "right",
                  },
                ].map((col) => {
                  return (
                    <th
                      key={col.key}
                      className={clsx(
                        "p-3 font-medium",
                        col.align === "right" ? "text-right" : "text-left"
                      )}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {items.map((category) => (
                <AdminCategoriesRow
                  key={category.id}
                  category={category}
                  onEdit={(cat) => {
                    setEditingCategory(cat);
                    setCreateOpen(true);
                  }}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateCategory
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        cat={editingCategory}
        onCreated={() => {
          setCreateOpen(false);
          load();
        }}
      />
    </div>
  );
}
