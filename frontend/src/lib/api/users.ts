import http from "@/src/lib/http/axios";
import type { AuthUser } from "@/src/lib/auth/tokens";

export async function getMe(): Promise<AuthUser> {
  const { data } = await http.get("/users/me");
  return data as AuthUser;
}
