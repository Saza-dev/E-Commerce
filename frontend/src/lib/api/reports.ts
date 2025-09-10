import http from "@/src/lib/http/axios";

export async function getOverview(params?: { from?: string; to?: string }) {
  const { data } = await http.get("/admin/reports/overview", { params });
  return data as {
    range: { from: string; to: string };
    revenue: number;
    ordersCount: number;
    itemsSold: number;
    aov: number;
    newUsers: number;
    distinctBuyerCount: number;
    repeatRate: number;
  };
}

export async function getSalesByDay(params?: { days?: number }) {
  const { data } = await http.get("/admin/reports/sales-by-day", { params });
  return data as Array<{ date: string; revenue: number }>;
}

export async function getSalesByCategory(params?: {
  from?: string;
  to?: string;
}) {
  const { data } = await http.get("/admin/reports/sales-by-category", {
    params,
  });
  return data as Array<{
    categoryId: number;
    category: string;
    revenue: number;
    qty: number;
  }>;
}

export async function getTopProducts(params?: {
  from?: string;
  to?: string;
  limit?: number;
}) {
  const { data } = await http.get("/admin/reports/top-products", { params });
  return data as Array<{
    productId: number;
    productName: string;
    revenue: number;
    qty: number;
  }>;
}

export async function getOrderStatusBreakdown(params?: {
  from?: string;
  to?: string;
}) {
  const { data } = await http.get("/admin/reports/order-status-breakdown", {
    params,
  });
  return data as Array<{
    status: "PROCESSING" | "FULFILLED" | "CANCELLED";
    count: number;
  }>;
}

export async function getNewUsersByWeek(params?: { days?: number }) {
  const { data } = await http.get("/admin/reports/new-users-by-week", {
    params,
  });
  return data as Array<{ week: string; count: number }>;
}

export async function getLowStock(params?: { threshold?: number }) {
  const { data } = await http.get("/admin/reports/low-stock", { params });
  return data as Array<{
    variantId: number;
    productId: number;
    productName: string;
    size: string | null;
    color: string | null;
    quantity: number;
    price: number;
  }>;
}
