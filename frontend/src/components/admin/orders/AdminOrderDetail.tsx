"use client";

import { useEffect, useState } from "react";

import {
  adminGetOrder,
  adminUpdateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/src/lib/api/orders";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const STATUSES: OrderStatus[] = ["PROCESSING", "FULFILLED", "CANCELLED"];

export default function AdminOrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await adminGetOrder(id);
        if (!cancelled) setOrder(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function changeStatus(status: OrderStatus) {
    if (!order) return;
    if (status === "CANCELLED" && !confirm("Cancel this order?")) return;

    setUpdating(true);
    try {
      const updated = await adminUpdateOrderStatus(order.id, status);
      setOrder(updated);
      toast.success("Order Updated");
      router.push("/admin/orders");
    } catch (e: any) {
      toast.error(e);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div>Loading…</div>;
  if (error || !order)
    return <div className="text-red-600">{error || "Not found"}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Order {order.id}</h1>
          <div className="text-sm text-gray-600">
            Placed {new Date(order.createdAt).toLocaleString()} · User{" "}
            {order.userId}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-3 py-2"
            value={order.status}
            onChange={(e) => changeStatus(e.target.value as OrderStatus)}
            disabled={updating}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Totals */}
      <div className="grid md:grid-cols-4 gap-4">
        <SummaryCard label="Items Total" value={order.itemsTotal} />
        <SummaryCard label="Shipping Fee" value={order.shippingFee} />
        <SummaryCard label="Discount" value={order.discount} />
        <SummaryCard label="Grand Total" value={order.totalAmount} highlight />
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className="bg-white border rounded p-4">
          <div className="font-medium mb-2">Shipping Address</div>
          <div className="text-sm text-gray-700 space-y-0.5">
            <div>{order.shippingAddress.fullName}</div>
            <div>{order.shippingAddress.line1}</div>
            {order.shippingAddress.line2 && (
              <div>{order.shippingAddress.line2}</div>
            )}
            <div>
              {order.shippingAddress.city}
              {order.shippingAddress.state
                ? `, ${order.shippingAddress.state}`
                : ""}{" "}
              {order.shippingAddress.postalCode}
            </div>
            <div>{order.shippingAddress.country}</div>
            {order.shippingAddress.phone && (
              <div>☎ {order.shippingAddress.phone}</div>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="text-left px-3 py-2">Product</th>
              <th className="text-left px-3 py-2">Variant</th>
              <th className="text-left px-3 py-2">Qty</th>
              <th className="text-left px-3 py-2">Unit</th>
              <th className="text-left px-3 py-2">Line Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {order.items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="px-3 py-2">{it.productName}</td>
                <td className="px-3 py-2">
                  {it.variantColor ?? "-"} / {it.variantSize ?? "-"}
                </td>
                <td className="px-3 py-2">{it.quantity}</td>
                <td className="px-3 py-2">{it.unitPrice.toFixed(2)}</td>
                <td className="px-3 py-2">{it.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-600">
        Paid {order.paidAmount.toFixed(2)} on{" "}
        {new Date(order.paidAt).toLocaleString()} via {order.paymentMethod}.
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded border p-4 ${
        highlight ? "bg-emerald-50 border-emerald-200" : "bg-white"
      }`}
    >
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold mt-1">{value.toFixed(2)}</div>
    </div>
  );
}
