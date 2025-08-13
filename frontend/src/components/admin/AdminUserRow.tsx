"use client";

import { useState } from "react";
import type { AdminUser } from "@/src/lib/api/admin";
import { setUserRole, setUserStatus } from "@/src/lib/api/admin";
import Button from "@/src/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminUserRow({
  u,
  onUpdated,
  onDelete,
}: {
  u: AdminUser;
  onUpdated: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  const [role, setRole] = useState<"ADMIN" | "CUSTOMER">(u.role);
  const [status, setStatus] = useState<"ACTIVE" | "SUSPENDED">(u.status);
  const [loadingRole, setLoadingRole] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const applyRole = async () => {
    if (role === u.role) return;
    setLoadingRole(true);
    try {
      const upd = await setUserRole(u.id, role);
      onUpdated(upd);
      toast.success("Role updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update role");
      setRole(u.role);
    } finally {
      setLoadingRole(false);
    }
  };

  const applyStatus = async () => {
    if (status === u.status) return;
    setLoadingStatus(true);
    try {
      const upd = await setUserStatus(u.id, status);
      onUpdated(upd);
      toast.success("Status updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update status");
      setStatus(u.status);
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <tr className="border-b last:border-0">
      <td className="py-3">
        <div className="font-medium">{u.email}</div>
        <div className="text-xs text-gray-500">{u.name || "—"}</div>
      </td>
      <td className="py-3 text-sm">{u.phone || "—"}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <Button
            className="!px-3 !py-1 text-xs"
            onClick={applyRole}
            disabled={loadingRole || role === u.role}
          >
            {loadingRole ? "Saving…" : "Apply"}
          </Button>
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
          <Button
            className="!px-3 !py-1 text-xs"
            onClick={applyStatus}
            disabled={loadingStatus || status === u.status}
          >
            {loadingStatus ? "Saving…" : "Apply"}
          </Button>
        </div>
      </td>
      <td className="py-3 text-right space-x-3">
        <Link
          href={`/admin/addresses?userId=${u.id}`}
          className="text-sm underline"
        >
          Addresses
        </Link>
        <button
          className="text-sm text-red-600 underline"
          onClick={() => onDelete(u)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
