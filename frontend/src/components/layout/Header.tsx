"use client";

import Link from "next/link";
import Button from "@/src/components/ui/button";
import { useAuth } from "@/src/contexts/AuthContext";

export default function AppHeader() {
  const { user, authenticated, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">
          E-Commerce
        </Link>

        {!authenticated ? (
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <span className="text-gray-600 hidden sm:inline">
              {user?.email}
            </span>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Link href="/addresses">
              <Button variant="ghost">Addresses</Button>
            </Link>
            {user?.role === "ADMIN" && (
              <>
                <Link href="/admin/users">
                  <Button variant="ghost">Admin Users</Button>
                </Link>
                <Link href="/admin/addresses">
                  <Button variant="ghost">Admin Addresses</Button>
                </Link>
              </>
            )}
            <Button onClick={logout}>Logout</Button>
          </nav>
        )}
      </div>
    </header>
  );
}
