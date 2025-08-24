"use client";

import Link from "next/link";
import Button from "@/src/components/ui/button";
import { useAuth } from "@/src/contexts/AuthContext";
import { FaUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

export default function AppHeader() {
  const { user, authenticated, logout } = useAuth();
  const userId = user?.id;

  return (
    <header className="shadow pt-4 pb-4 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold text-[20px] flex  items-center gap-2">
          Fashion
          <FaHouse />
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
            <Link href="/profile">
              <Button variant="ghost">
                <FaUser />
              </Button>
            </Link>
            <Link href={`/cart/${userId}`}>
              <Button variant="ghost">
                <FaShoppingCart />
              </Button>
            </Link>
            {user?.role === "ADMIN" && (
              <>
                <Link href="/admin/dashboard">
                  <Button variant="ghost">Dashboard</Button>
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
