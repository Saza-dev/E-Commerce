import http from "@/src/lib/http/axios";
import { setTokens } from "@/src/lib/auth/tokens";

type LoginDto = { email: string; password: string };
type RegisterDto = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
};

export async function login(dto: LoginDto) {
  const { data } = await http.post("/auth/login", dto, {
    skipAuthRefresh: true,
  });
  // backend returns: { user, accessToken, refreshToken }
  if (data?.accessToken && data?.refreshToken) {
    setTokens(
      { accessToken: data.accessToken, refreshToken: data.refreshToken },
      data.user
    );
  }
  return data;
}

export async function register(dto: RegisterDto) {
  const { data } = await http.post("/auth/register", dto, {
    skipAuthRefresh: true,
  });
  if (data?.accessToken && data?.refreshToken) {
    setTokens(
      { accessToken: data.accessToken, refreshToken: data.refreshToken },
      data.user
    );
  }
  return data;
}

export async function logout(refreshToken: string) {
  // Single-session logout; backend expects refreshToken in body
  try {
    await http.post(
      "/auth/logout",
      { refreshToken },
      { skipAuthRefresh: true }
    );
  } finally {
    // Clear on client regardless
    const { clearAuth } = await import("@/src/lib/auth/tokens");
    clearAuth();
  }
}

export async function logoutAll() {
  // Access-token protected; no body needed
  try {
    await http.post("/auth/logout-all", {}, { skipAuthRefresh: true });
  } finally {
    const { clearAuth } = await import("@/src/lib/auth/tokens");
    clearAuth();
  }
}

export async function requestPasswordReset(email: string) {
  const { data } = await http.post(
    "/auth/request-password-reset",
    { email },
    { skipAuthRefresh: true }
  );
  return data; // { success: true, resetToken?: string }
}

export async function resetPassword(token: string, newPassword: string) {
  const { data } = await http.post(
    "/auth/reset-password",
    { token, newPassword },
    { skipAuthRefresh: true }
  );
  return data; // { success: true }
}
