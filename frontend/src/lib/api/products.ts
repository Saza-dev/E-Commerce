import http from "../http/axios";

export type Product = {
  id: number;
  name: string;
  description: string;
  slug: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  variants: Variant[];
};

export type Variant = {
  id: number;
  productId: number;
  size: string;
  color: string;
  price: number;
  quantity: number;
  status: "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK";
  images: Image[];
};

export type Image = {
  id: number;
  variantId: number;
  url: string;
};

// Create Product
export async function createProduct(payload: {
  name: string;
  description: string;
  slug: string;
  categoryId: number;
  variants: {
    size: string;
    color: string;
    price: number;
    quantity: number;
    status: "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK";
    images: string[];
  }[];
}): Promise<Product> {
  const { data } = await http.post(`/admin/products`, payload);
  return data;
}

// Update Product
export async function updateProduct(
  id: number,
  payload: {
    name?: string;
    description?: string;
    slug?: string;
    categoryId?: number;
  }
) {
  const { data } = await http.put(`/admin/products/${id}`, payload);
  return data as {
    id: number;
    name: string;
    description: string;
    slug: string;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Delete Product
export async function deleteProduct(id: number): Promise<{ success: true }> {
  const { data } = await http.delete(`/admin/products/${id}`);
  return data;
}

// Update Variant
export async function updateVariant(
  prodId: number,
  variantId: number,
  payload: {
    size?: string;
    color?: string;
    price?: number;
    quantity?: number;
    status?: "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK";
    images?: string[];
  }
) {
  const { data } = await http.put(
    `/admin/products/${prodId}/variants/${variantId}`,
    payload
  );
  return data as {
    id: number;
    productId: number;
    size: string;
    color: string;
    price: number;
    quantity: number;
    status: "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK";
    images: string[];
  };
}

// list all Products
export async function listProducts(): Promise<Product[]> {
  const { data } = await http.get("/products");
  return data;
}

// List Products by Slug
export async function listProductBySlug(slug: string): Promise<Product> {
  const { data } = await http.get(`/products/${slug}`);
  return data;
}
