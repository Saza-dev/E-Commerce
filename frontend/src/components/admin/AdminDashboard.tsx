"use client";

import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <main>
      {
        <nav>
          {user?.role === "ADMIN" && (
            <div className="grid grid-cols-4 gap-10">
              <Link href="/admin/users">
                <div className="border w-[280px] h-[100px] text-[50px] flex items-center justify-center">
                  Users
                </div>
              </Link>
              <Link href="/admin/categories">
                <div className="border w-[280px] h-[100px] text-[50px] flex items-center justify-center">
                  Categories
                </div>
              </Link>
              <Link href="/admin/products">
                <div className="border w-[280px] h-[100px] text-[50px] flex items-center justify-center">
                  Products
                </div>
              </Link>
            </div>
          )}
        </nav>
      }
    </main>
  );
}
