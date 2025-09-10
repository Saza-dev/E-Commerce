"use client";

import { listMyAddresses, type Address } from "@/src/lib/api/addresses";
import { placeOrder, type Order } from "@/src/lib/api/orders";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Checkout({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<string>("0");
  const [discount, setDiscount] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await listMyAddresses();
        setAddresses(data);
        const def = data.find((a) => a.isDefault) ?? data[0];
        if (def) setAddressId(def.id);
      } catch (e: any) {
        setError(e.message || "Failed to load addresses");
      }
    })();
  }, []);

  const canPlace = useMemo(
    () => Boolean(addressId) && Boolean(userId) && !loading,
    [addressId, userId, loading]
  );

  async function onPlace() {
    setLoading(true);
    setError(null);
    try {
      const created = await placeOrder({
        userId,
        addressId,
        shippingFee: Number(shippingFee || 0),
        discount: Number(discount || 0),
      });
      if (created) {
        toast.success("Order Placed");
        router.push(`/orders/${created.userId}/${created.id}`);
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <div className="space-y-6">
        <section>
          <label className="block text-sm font-medium mb-2">
            Shipping Address
          </label>
          <select
            className="w-full rounded-xl border px-3 py-2"
            value={addressId}
            onChange={(e) => setAddressId(e.target.value)}
          >
            <option value="" disabled>
              Choose an address…
            </option>
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.line1}, {a.city} {a.postalCode ?? ""} ({a.country})
              </option>
            ))}
          </select>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Shipping Fee
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={shippingFee}
              onChange={(e) => setShippingFee(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
        </section>

        <button
          className="rounded-2xl px-4 py-2 border shadow disabled:opacity-50"
          disabled={!canPlace}
          onClick={onPlace}
        >
          {loading ? "Placing…" : "Place Order (Pay by Card)"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </main>
  );
}
