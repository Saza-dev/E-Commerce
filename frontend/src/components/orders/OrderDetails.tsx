"use client";

import Link from "next/link";
import Button from "../ui/button";
import Money from "../ui/Money";
import OrderStatusBadge from "./OrderStatusBadge";
import { useEffect, useState } from "react";
import { getOrder, type Order } from "@/src/lib/api/orders";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || e.message || "Failed to load order"
        );
      }
    })();
  }, [orderId]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-red-500 text-sm">{error}</p>
      </main>
    );
  }
  if (!order) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Order {order.id.slice(0, 10)}…
        </h1>
        <OrderStatusBadge status={order.status} />
      </header>

      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Summary</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Items total:</span>{" "}
            <Money value={order.itemsTotal} />
          </div>
          <div>
            <span className="text-gray-500">Shipping:</span>{" "}
            <Money value={order.shippingFee} />
          </div>
          <div>
            <span className="text-gray-500">Discount:</span>{" "}
            <Money value={order.discount} />
          </div>
          <div>
            <span className="text-gray-500">Grand total:</span>{" "}
            <Money value={order.totalAmount} />
          </div>
          <div>
            <span className="text-gray-500">Paid:</span>{" "}
            <Money value={order.paidAmount} />
          </div>
          <div>
            <span className="text-gray-500">Placed:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="divide-y">
          {order.items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between py-3 text-sm"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{it.productName}</div>
                <div className="text-gray-500">
                  {it.variantColor ?? "—"} / {it.variantSize ?? "—"}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>Qty: {it.quantity}</div>
                <div>
                  <Money value={it.unitPrice} />{" "}
                  <span className="text-gray-500">LKR</span>
                </div>
                <div className="font-medium">
                  <Money value={it.lineTotal} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {order.shippingAddress && (
        <section className="rounded-2xl border p-4">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <div className="text-sm">
            <div>{order.shippingAddress.line1}</div>
            {order.shippingAddress.line2 && (
              <div>{order.shippingAddress.line2}</div>
            )}
            <div>
              {order.shippingAddress.city}
              {order.shippingAddress.state
                ? `, ${order.shippingAddress.state}`
                : ""}{" "}
              {order.shippingAddress.postalCode ?? ""}
            </div>
            <div>{order.shippingAddress.country}</div>
            {order.shippingAddress.phone && (
              <div>☎ {order.shippingAddress.phone}</div>
            )}
          </div>
        </section>
      )}

      <Link href={"/"}>
        <Button>Home</Button>
      </Link>
    </main>
  );
}
