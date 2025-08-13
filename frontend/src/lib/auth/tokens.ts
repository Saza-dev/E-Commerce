/* Token + auth state helpers for browser-only usage (localStorage) */

export type UserRole = "ADMIN" | "CUSTOMER";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  name?: string | null;
  phone?: string | null;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user?: AuthUser | null;
}

const AUTH_STORAGE_KEY = "auth";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readAuth(): AuthState {
  if (!isBrowser())
    return { accessToken: null, refreshToken: null, user: null };
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null, user: null };
    const parsed = JSON.parse(raw) as AuthState;
    return {
      accessToken: parsed?.accessToken ?? null,
      refreshToken: parsed?.refreshToken ?? null,
      user: parsed?.user ?? null,
    };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
}

export function writeAuth(next: AuthState) {
  if (!isBrowser()) return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next ?? null));
}

export function setTokens(
  tokens: { accessToken: string; refreshToken: string },
  user?: AuthUser | null
) {
  const current = readAuth();
  writeAuth({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: user ?? current.user ?? null,
  });
}

export function setUser(user: AuthUser | null) {
  const current = readAuth();
  writeAuth({ ...current, user });
}

export function clearAuth() {
  if (!isBrowser()) return;
  // Use setItem instead of removeItem so "storage" event fires across tabs consistently
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(null));
}

export function getAccessToken(): string | null {
  return readAuth().accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return readAuth().refreshToken ?? null;
}

/** Cross-tab sync: call this once (Step 2 will do it inside the AuthProvider) */
export function onAuthStorageChange(cb: (state: AuthState) => void) {
  if (!isBrowser()) return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === AUTH_STORAGE_KEY) cb(readAuth());
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
