"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/src/lib/api/orders";
import OrderStatusBadge from "@/src/components/orders/OrderStatusBadge";
import Money from "@/src/components/ui/Money";

const STATUSES: OrderStatus[] = ["PROCESSING", "FULFILLED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [userId, setUserId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListOrders({
        status: (status || undefined) as OrderStatus | undefined,
        userId: userId || undefined,
        page,
        pageSize,
      });
      setOrders(res.items);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin · Orders</h1>

      <div className="mb-4 flex items-end gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select
            className="rounded-xl border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">User ID</label>
          <input
            className="rounded-xl border px-3 py-2 w-64"
            placeholder="Filter by userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <button
          className="rounded-2xl px-4 py-2 border shadow"
          onClick={() => {
            setPage(1);
            load();
          }}
        >
          Apply
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Placed</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="py-2 pr-4 font-medium">{o.id.slice(0, 10)}…</td>
                <td className="py-2 pr-4">{o.userId.slice(0, 10)}…</td>
                <td className="py-2 pr-4"><OrderStatusBadge status={o.status} /></td>
                <td className="py-2 pr-4"><Money value={o.totalAmount} /></td>
                <td className="py-2 pr-4">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        disabled={updatingId === o.id || o.status === s}
                        onClick={async () => {
                          try {
                            setUpdatingId(o.id);
                            await adminUpdateOrderStatus(o.id, s);
                            await load();
                          } catch (e: any) {
                            alert(e?.response?.data?.message || e.message || "Failed to update");
                          } finally {
                            setUpdatingId(null);
                          }
                        }}
                        className={`rounded-xl border px-3 py-1 text-xs ${
                          o.status === s ? "opacity-50" : ""
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-3">
        <button
          className="rounded-xl border px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          Prev
        </button>
        <div className="text-sm">
          Page {page} / {totalPages}
        </div>
        <button
          className="rounded-xl border px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </main>
  );
}
