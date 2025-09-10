"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import {
  adminListOrders,
  type Order,
  type OrderStatus,
} from "@/src/lib/api/orders";
import OrderStatusBadge from "@/src/components/orders/OrderStatusBadge";

export default function AdminOrdersTable() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);

  const STATUSES: OrderStatus[] = ["PROCESSING", "FULFILLED", "CANCELLED"];

  const params = useMemo(
    () => ({
      status: status || undefined,
      userId: userId || undefined,
      page,
      pageSize,
    }),
    [status, userId, page, pageSize]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminListOrders(params);
        if (!cancelled) {
          setItems(res.items);
          setTotal(res.total);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 bg-white p-4 rounded border">
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Status</label>
          <select
            className="border rounded px-3 py-2"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as any);
            }}
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">User ID</label>
          <input
            className="border rounded px-3 py-2 w-80"
            placeholder="Filter by userId"
            value={userId}
            onChange={(e) => {
              setPage(1);
              setUserId(e.target.value);
            }}
          />
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Page size</label>
          <select
            className="border rounded px-2 py-2"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="text-left px-3 py-2 w-40">Order ID</th>
              <th className="text-left px-3 py-2 w-40">User</th>
              <th className="text-left px-3 py-2 w-32">Created</th>
              <th className="text-left px-3 py-2 w-28">Items</th>
              <th className="text-left px-3 py-2 w-28">Total</th>
              <th className="text-left px-3 py-2 w-36">Status</th>
              <th className="text-left px-3 py-2 w-28">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading && (
              <tr>
                <td className="px-3 py-6 text-center" colSpan={7}>
                  Loading…
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td className="px-3 py-6 text-red-600 text-center" colSpan={7}>
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={7}>
                  No orders
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              items.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-3 py-2 font-mono truncate">{o.id}</td>
                  <td className="px-3 py-2 truncate">{o.userId}</td>
                  <td className="px-3 py-2">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{o.items?.length ?? 0}</td>
                  <td className="px-3 py-2">{o.totalAmount.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      className="text-blue-600 hover:underline"
                      href={`/admin/orders/${o.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-3 py-2 border-t bg-white">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages} · {total} total
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
