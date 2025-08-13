"use client";

import { useEffect, useState } from "react";
import Protected from "@/src/components/auth/Protected";
import { listAddressesByUser } from "@/src/lib/api/admin";
import type { Address } from "@/src/lib/api/addresses";
import AddressCard from "@/src/components/address/AddressCard";
import Button from "@/src/components/ui/button";
import { Input, Label } from "@/src/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

function AdminAddressesInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string>(sp.get("userId") || "");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Address[]>([]);

  const load = async (id: string) => {
    if (!id) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await listAddressesByUser(id);
      setItems(data);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  // auto-load when query param exists
  useEffect(() => {
    const id = sp.get("userId");
    if (id) {
      setUserId(id);
      load(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async () => {
    router.replace(`/admin/addresses?userId=${encodeURIComponent(userId)}`);
    await load(userId);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5">
        <h1 className="text-lg font-semibold">User Addresses</h1>
        <p className="text-sm text-gray-600">
          Enter a userId to view their saved addresses.
        </p>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <div className="flex-1">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="cuid of user"
          />
        </div>
        <Button onClick={onSearch} disabled={!userId}>
          Load
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">
          No addresses found for this user.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((a) => (
            <AddressCard key={a.id} address={a} readOnly />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminAddressesPage() {
  return (
    <Protected requiredRole="ADMIN">
      <AdminAddressesInner />
    </Protected>
  );
}
