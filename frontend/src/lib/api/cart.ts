import http from "../http/axios";
import { Product } from "./products";
import { Variant } from "./variants";

export type Cart = {
  id: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
};

export type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  variantId: number;
  quantity: number;
  product?: Product;
  variant?: Variant;
};

// get cart
export async function getCart(userId: string): Promise<Cart> {
  const { data } = await http.get(`/cart/${userId}`);
  return data;
}

// add item to cart
export async function addToCart(
  userId: string,
  payload: {
    productId: number;
    variantId: number;
    quantity: number;
  }
): Promise<CartItem> {
  const { data } = await http.post(`/cart/add/${userId}`, payload);
  return data;
}

// Update Cart Item
export async function updateCartItem(
  userId: string,
  payload: {
    itemId: number;
    quantity: number;
  }
): Promise<CartItem> {
  const { data } = await http.patch(`/cart/update/${userId}`, payload);
  return data;
}

// Delete Cart Item
export async function deleteCartItem(
  userId: string,
  payload: {
    itemId: number;
  }
): Promise<{ success: true }> {
  const { data } = await http.delete(`/cart/remove/${userId}`, {
    data: payload,
  });
  return data;
}
