import http from "@/src/lib/http/axios";

export type Address = {
  id: string;
  userId: string;
  type: "SHIPPING" | "BILLING";
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  phone?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAddressDto = Omit<
  Address,
  "id" | "userId" | "createdAt" | "updatedAt"
>;
export type UpdateAddressDto = Partial<CreateAddressDto>;

export async function listMyAddresses(): Promise<Address[]> {
  const { data } = await http.get("/addresses");
  return data as Address[];
}

export async function createAddress(dto: CreateAddressDto): Promise<Address> {
  const { data } = await http.post("/addresses", dto);
  return data as Address;
}

export async function updateAddress(
  id: string,
  dto: UpdateAddressDto
): Promise<Address> {
  const { data } = await http.patch(`/addresses/${id}`, dto);
  return data as Address;
}

export async function deleteAddress(id: string): Promise<{ success: true }> {
  const { data } = await http.delete(`/addresses/${id}`);
  return data as { success: true };
}

export async function makeDefault(id: string): Promise<{ success: true }> {
  const { data } = await http.patch(`/addresses/${id}/default`, {});
  return data as { success: true };
}
