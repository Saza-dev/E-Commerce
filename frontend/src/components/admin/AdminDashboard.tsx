"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Analytics from "./Analytics";
import {
  LayoutDashboard,
  Users,
  Boxes,
  FolderOpen,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useMemo } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Simple nav model
  const nav = useMemo(
    () => [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/categories", label: "Categories", icon: FolderOpen },
      { href: "/admin/products", label: "Products", icon: Boxes },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 md:gap-6">
          {/* Sidebar */}
          <aside className="md:sticky md:top-6 h-max rounded-2xl border bg-white shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Admin</div>
                  <div className="font-semibold">Control Panel</div>
                </div>
              </div>
            </div>

            {user?.role === "ADMIN" ? (
              <nav className="p-2">
                {nav.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.href}
                  />
                ))}
                <div className="mt-2 h-px bg-gray-100" />
              </nav>
            ) : (
              <div className="p-4 text-sm text-gray-500">
                You don’t have permission to view admin items.
              </div>
            )}
          </aside>

          {/* Main content */}
          <main className="space-y-4 md:space-y-6">
            {/* Top bar */}
            <header className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                    {pathname === "/admin/dashboard" ? "Dashboard" : "Admin"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {user?.name ? `Welcome back, ${user.name}.` : "Welcome."}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                    ADMIN
                  </span>
                </div>
              </div>
            </header>

            {/* Analytics panel */}
            <section className="rounded-2xl border bg-white p-3 md:p-5 shadow-sm">
              <Analytics />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link href={href} className="block">
      <div
        className={[
          "mb-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
          active
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-800 hover:bg-gray-50",
        ].join(" ")}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
}
