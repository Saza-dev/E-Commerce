// src/lib/apis/orders.ts
import http from "@/src/lib/http/axios";

export type OrderStatus = "PROCESSING" | "FULFILLED" | "CANCELLED";
export type PaymentMethod = "CARD";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: number;
  variantId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productName: string;
  variantSize?: string | null;
  variantColor?: string | null;
};

export type AddressSnapshot = {
  id: string;
  userId?: string | null;
  originalAddressId?: string | null;
  fullName?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  phone?: string | null;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentRef?: string | null;

  itemsTotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  paidAt: string;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
  shippingAddress?: AddressSnapshot;
};

/* ===== Customer-facing ===== */

export async function placeOrder(payload: {
  userId: string;
  addressId: string;
  shippingFee?: number;
  discount?: number;
  paymentRef?: string;
}): Promise<Order> {
  const { data } = await http.post("/orders", payload);
  return data as Order;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await http.get(`/orders/${id}`);
  return data as Order;
}

export async function listMyOrders(userId:string): Promise<Order[]> {
  const { data } = await http.get(`/orders/all/${userId}`);
  return data as Order[];
}

/* ===== Admin ===== */

export async function adminListOrders(params?: {
  status?: OrderStatus;
  userId?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: Order[]; total: number; page: number; pageSize: number }> {
  const { data } = await http.get("/admin/orders", { params });
  return data;
}

export async function adminGetOrder(id: string): Promise<Order> {
  const { data } = await http.get(`/admin/orders/${id}`);
  return data as Order;
}

export async function adminUpdateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const { data } = await http.put(`/admin/orders/${id}/status`, { status });
  return data as Order;
}
