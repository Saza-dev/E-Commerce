"use client";

import Protected from "@/src/components/auth/Protected";
import AdminUsersTable from "@/src/components/admin/AdminUsersTable";

export default function AdminUsersPage() {
  return (
    <Protected requiredRole="ADMIN">
      <div className="mx-auto max-w-5xl">
        <AdminUsersTable />
      </div>
    </Protected>
  );
}
