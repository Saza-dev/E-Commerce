import http from "@/src/lib/http/axios";

export type ProfileDTO = {
  name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string; // YYYY-MM-DD
  avatarUrl?: string;
  notes?: string;
};

export async function getProfile() {
  const { data } = await http.get("/profile");
  // data: { user, profile }
  return data as { user: any; profile: any };
}

export async function updateProfile(dto: ProfileDTO) {
  const { data } = await http.patch("/profile", dto);
  // data: { user, profile }
  return data as { user: any; profile: any };
}
