import http from "../http/axios";
import type { Product } from "./products";

export type Category = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  children?: Category[];
};

export type SlugCategory = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  children?: Category[];
  products: Product[];
};

// Create Category
export async function createCategory(payload: {
  name: string;
  slug: string;
  parentId?: number | null;
}) {
  const { data } = await http.post(`/admin/categories`, payload);
  return data as Category;
}

// Update Category
export async function updateCategory(
  id: string,
  payload: {
    name?: string;
    slug?: string;
    parentId?: number;
  }
): Promise<Category> {
  const { data } = await http.put(`/admin/categories/${id}`, payload);
  return data;
}

// Delete Categories
export async function deleteCategory(id: number): Promise<{ success: true }> {
  const { data } = await http.delete(`/admin/categories/${id}`);
  return data;
}

// list categories admin
export async function listCategoriesAdmin(): Promise<Category[]> {
  const { data } = await http.get("/admin/categories");
  return data;
}

// list categories users
export async function listCategoriesUsers(): Promise<Category[]> {
  const { data } = await http.get("/categories");
  return data;
}

// list categories users
export async function listCategoryProductsBySlug(
  slug: string
): Promise<Product[]> {
  const { data } = await http.get(`/categories/${slug}`);
  return data;
}
