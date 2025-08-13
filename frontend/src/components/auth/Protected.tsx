"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

export default function Protected({
  children,
  requiredRole,
  fallback = null,
}: {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "CUSTOMER";
  fallback?: React.ReactNode;
}) {
  const { loading, authenticated, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const allowed = useMemo(() => {
    if (!authenticated) return false;
    if (requiredRole && role !== requiredRole) return false;
    return true;
  }, [authenticated, requiredRole, role]);

  useEffect(() => {
    if (loading) return;
    if (!authenticated) {
      // preserve intended path for post-login redirect if you want
      router.replace(`/auth/login`);
      return;
    }
    if (requiredRole && role !== requiredRole) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [loading, authenticated, requiredRole, role, router, pathname]);

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Checking session…
      </div>
    );
  }
  if (!allowed) return <>{fallback}</>;
  if (!ready) return null;

  return <>{children}</>;
}
