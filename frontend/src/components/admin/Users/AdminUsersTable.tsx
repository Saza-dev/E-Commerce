"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminUser, UsersQuery } from "@/src/lib/api/admin";
import { listUsers, deleteUser } from "@/src/lib/api/admin";
import AdminUserRow from "./AdminUserRow";
import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import toast from "react-hot-toast";
import clsx from "clsx";
import CreateAdminModal from "./CreateAdminModal";

const SORTABLE: UsersQuery["sortBy"][] = [
  "createdAt",
  "email",
  "role",
  "status",
];

export default function AdminUsersTable() {
  const [query, setQuery] = useState<UsersQuery>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortDir: "desc",
    q: "",
  });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / (query.pageSize || 10))),
    [total, query.pageSize]
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await listUsers(query);
      setItems(data.items);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query.page, query.pageSize, query.sortBy, query.sortDir, query.q]);

  const onUpdated = (upd: AdminUser) => {
    setItems((prev) => prev.map((x) => (x.id === upd.id ? upd : x)));
  };

  const onDelete = async (u: AdminUser) => {
    if (!confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
    try {
      await deleteUser(u.id);
      toast.success("User deleted");
      // reload current page; if page becomes empty, go back one
      if (items.length === 1 && (query.page || 1) > 1) {
        setQuery((q) => ({ ...q, page: (q.page || 1) - 1 }));
      } else {
        load();
      }
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const toggleSort = (key: UsersQuery["sortBy"]) => {
    if (!key) return;
    setQuery((q) => {
      const dir =
        q.sortBy === key ? (q.sortDir === "asc" ? "desc" : "asc") : "asc";
      return { ...q, sortBy: key, sortDir: dir, page: 1 };
    });
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-end gap-3">
          <div>
            <Label htmlFor="search">Search (email/name)</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="john@site.com"
                value={query.q || ""}
                onChange={(e) => setQuery((q) => ({ ...q, q: e.target.value }))}
              />
              <Button
                variant="ghost"
                onClick={() => setQuery((q) => ({ ...q, page: 1 }))}
              >
                Search
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  setQuery({
                    page: 1,
                    pageSize: 10,
                    sortBy: "createdAt",
                    sortDir: "desc",
                    q: "",
                  })
                }
              >
                Reset
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="pageSize">Page size</Label>
            <select
              id="pageSize"
              className="rounded-md border border-gray-300 px-2 py-2 text-sm"
              value={query.pageSize}
              onChange={(e) =>
                setQuery((q) => ({
                  ...q,
                  pageSize: Number(e.target.value),
                  page: 1,
                }))
              }
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={() => setCreateOpen(true)}>Create Admin</Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">No users found.</div>
      ) : (
        <div className="overflow-auto rounded-xl">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                {[
                  { key: "email", label: "Email / Name" },
                  { key: "phone", label: "Phone", unsortable: true },
                  { key: "role", label: "Role" },
                  { key: "status", label: "Status" },
                  {
                    key: "actions",
                    label: "Actions",
                    unsortable: true,
                    align: "right",
                  },
                ].map((col) => {
                  const sortable =
                    !col.unsortable && (SORTABLE as string[]).includes(col.key);
                  const active = sortable && query.sortBy === col.key;
                  return (
                    <th
                      key={col.key}
                      className={clsx(
                        "p-3 font-medium",
                        col.align === "right" ? "text-right" : "text-left"
                      )}
                    >
                      {sortable ? (
                        <button
                          className="inline-flex items-center gap-1 hover:underline"
                          onClick={() => toggleSort(col.key as any)}
                        >
                          {col.label}
                          <span className="text-[10px]">
                            {active
                              ? query.sortDir === "asc"
                                ? "▲"
                                : "▼"
                              : ""}
                          </span>
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <AdminUserRow
                  key={u.id}
                  u={u}
                  onUpdated={onUpdated}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Total: {total} • Page {query.page} / {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setQuery((q) => ({ ...q, page: 1 }))}
            disabled={(query.page || 1) === 1}
          >
            First
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              setQuery((q) => ({ ...q, page: Math.max(1, (q.page || 1) - 1) }))
            }
            disabled={(query.page || 1) === 1}
          >
            Prev
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              setQuery((q) => ({
                ...q,
                page: Math.min(totalPages, (q.page || 1) + 1),
              }))
            }
            disabled={(query.page || 1) >= totalPages}
          >
            Next
          </Button>
          <Button
            variant="ghost"
            onClick={() => setQuery((q) => ({ ...q, page: totalPages }))}
            disabled={(query.page || 1) >= totalPages}
          >
            Last
          </Button>
        </div>
      </div>

      <CreateAdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          load();
        }}
      />
    </div>
  );
}
