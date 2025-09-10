"use client";

import Link from "next/link";
import Money from "../ui/Money";
import OrderStatusBadge from "./OrderStatusBadge";
import { useEffect, useState } from "react";
import { listMyOrders, type Order } from "@/src/lib/api/orders";

export default function Orders({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listMyOrders(userId);
        setOrders(data);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || e.message || "Failed to load orders"
        );
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Placed</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="py-2 pr-4 font-medium">{o.id.slice(0, 10)}…</td>
                <td className="py-2 pr-4">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="py-2 pr-4">
                  <Money value={o.totalAmount} />
                </td>
                <td className="py-2 pr-4">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="py-2 pr-4">
                  <Link
                    className="underline"
                    href={`/orders/${userId}/${o.id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-gray-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
