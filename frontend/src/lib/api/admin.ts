import http from "@/src/lib/http/axios";
import type { Address } from "@/src/lib/api/addresses";

export type AdminUser = {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  status: "ACTIVE" | "SUSPENDED";
  name?: string | null;
  phone?: string | null;
  createdAt: string;
};

export type UsersQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: "createdAt" | "email" | "role" | "status";
  sortDir?: "asc" | "desc";
};

export async function listUsers(
  query: UsersQuery = {}
): Promise<{
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const { data } = await http.get("/admin/users", { params: query });
  return data;
}

export async function setUserRole(userId: string, role: "ADMIN" | "CUSTOMER") {
  const { data } = await http.patch(`/admin/users/${userId}/role`, { role });
  return data as AdminUser;
}

export async function setUserStatus(
  userId: string,
  status: "ACTIVE" | "SUSPENDED"
) {
  const { data } = await http.patch(`/admin/users/${userId}/status`, {
    status,
  });
  return data as AdminUser;
}

export async function deleteUser(userId: string) {
  const { data } = await http.delete(`/admin/users/${userId}`);
  return data as { success: true };
}

export async function createAdmin(payload: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}) {
  const { data } = await http.post(`/admin/users`, payload);
  return data as AdminUser;
}

export async function listAddressesByUser(userId: string): Promise<Address[]> {
  const { data } = await http.get("/admin/addresses", { params: { userId } });
  return data as Address[];
}
