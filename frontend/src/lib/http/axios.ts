import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/src/lib/auth/tokens";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Extend config to mark retried requests / skip refresh loop
declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // we’re using tokens in headers, not cookies
});

// ----- Request: attach access token -----
http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----- Single-flight refresh state -----
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // If a refresh is already in progress, reuse it.
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  // Use a bare axios client to avoid interceptor loops
  const raw = axios.create({ baseURL: API_BASE_URL });

  refreshPromise = raw
    .post(
      "/auth/refresh",
      { refreshToken },
      { headers: { "Content-Type": "application/json" }, timeout: 15000 }
    )
    .then((res) => {
      const { accessToken, refreshToken: nextRefresh } = res.data || {};
      if (!accessToken || !nextRefresh) return null;
      setTokens({ accessToken, refreshToken: nextRefresh });
      return accessToken as string;
    })
    .catch(() => null)
    .finally(() => {
      // release the lock
      refreshPromise = null;
    });

  return refreshPromise;
}

// ----- Response: 401 -> try refresh -> retry original -----
http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig | undefined;

    // If no config or we've already retried, or this call explicitly skips refresh, bail.
    if (!config || config._retry || config.skipAuthRefresh) {
      throw error;
    }

    const status = error.response?.status;
    const isUnauthorized = status === 401;

    // Never attempt to refresh if the failing endpoint is itself /auth/refresh
    const url = (config.baseURL || "") + (config.url || "");
    const isRefreshEndpoint = /\/auth\/refresh$/.test(url);

    if (isUnauthorized && !isRefreshEndpoint) {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        config._retry = true;
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${newAccess}`;
        return http.request(config);
      }
      // Refresh failed -> clear and hard-redirect to login
      clearAuth();
      if (typeof window !== "undefined") window.location.href = "/auth/login";
    }

    throw error;
  }
);

export default http;
