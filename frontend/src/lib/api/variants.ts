import http from "../http/axios";

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

// Create Variant
export async function createVariant(payload: {
    productId: number;
    size: string;
    color: string;
    price: number;
    quantity: number;
    status: "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK";
    images: string[];
}): Promise<Variant> {
  const { data } = await http.post(`/admin/variants`, payload);
  return data;
}

// Update Variant
export async function updateVariant(
  id: number,
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
    `/admin/products/${id}/variants/${variantId}`,
    payload
  );
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
export async function deleteVariant(id: number): Promise<{ success: true }> {
  const { data } = await http.delete(`/admin/variants/${id}`);
  return data;
}
