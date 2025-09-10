import type { OrderStatus } from "@/src/lib/api/orders";


export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cls =
    status === "FULFILLED"
      ? "bg-green-100 text-green-800"
      : status === "CANCELLED"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}
