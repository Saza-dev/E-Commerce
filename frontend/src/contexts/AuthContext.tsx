"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMe } from "@/src/lib/api/users";
import {
  AuthState,
  AuthUser,
  clearAuth,
  onAuthStorageChange,
  readAuth,
  setUser,
} from "@/src/lib/auth/tokens";
import * as AuthAPI from "@/src/lib/api/auth";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
  role: "ADMIN" | "CUSTOMER" | null;
  login: (email: string, password: string) => Promise<void>;
  register: (dto: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshFromStorage: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user }, setLocal] = useState<{ user: AuthUser | null }>({
    user: null,
  });
  const [loading, setLoading] = useState(true);

  const refreshFromStorage = useCallback(() => {
    const snap = readAuth();
    // Only user lives in React state; tokens live in localStorage for axios.
    setLocal((s) => ({ ...s, user: (snap.user as AuthUser) ?? null }));
  }, []);

  // Initial hydrate + verify session via /users/me (axios will auto-refresh if needed)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snapshot = readAuth();
        if (snapshot.accessToken || snapshot.refreshToken) {
          // try to verify
          const me = await getMe().catch(() => null);
          if (!cancelled) {
            if (me) {
              setUser(me);
              setLocal({ user: me });
            } else {
              clearAuth();
              setLocal({ user: null });
            }
          }
        } else {
          setLocal({ user: null });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const off = onAuthStorageChange((_state: AuthState) =>
      refreshFromStorage()
    );
    return () => {
      off && off();
    };
  }, [refreshFromStorage]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await AuthAPI.login({ email, password });
    if (res?.user) {
      setUser(res.user);
      setLocal({ user: res.user });
    }
  }, []);

  const register = useCallback(
    async (dto: {
      email: string;
      password: string;
      name?: string;
      phone?: string;
    }) => {
      const res = await AuthAPI.register(dto);
      if (res?.user) {
        setUser(res.user);
        setLocal({ user: res.user });
      }
    },
    []
  );

  const logout = useCallback(async () => {
    const snap = readAuth();
    const refreshToken = snap.refreshToken ?? "";
    await AuthAPI.logout(refreshToken);
    setLocal({ user: null });
  }, []);

  const logoutAll = useCallback(async () => {
    await AuthAPI.logoutAll();
    setLocal({ user: null });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      authenticated: !!user,
      role: user?.role ?? null,
      login,
      register,
      logout,
      logoutAll,
      refreshFromStorage,
    }),
    [user, loading, login, register, logout, logoutAll, refreshFromStorage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
