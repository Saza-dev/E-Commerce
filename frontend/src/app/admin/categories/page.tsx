"use client";

import AdminCategoriesTable from "@/src/components/admin/categories/AdminCategoriesTable";
import Protected from "@/src/components/auth/Protected";

export default function AdminUsersPage() {
  return (
    <Protected requiredRole="ADMIN">
      <div className="mx-auto max-w-5xl">
        <AdminCategoriesTable />
      </div>
    </Protected>
  );
}
