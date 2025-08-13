"use client";

import { useEffect, useMemo, useState } from "react";
import Protected from "@/src/components/auth/Protected";
import Button from "@/src/components/ui/button";
import Modal from "@/src/components/ui/modal";
import AddressCard from "@/src/components/address/AddressCard";
import {
  Address,
  listMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  makeDefault,
} from "@/src/lib/api/addresses";
import toast from "react-hot-toast";
import AddressForm, {
  AddressFormValues,
} from "@/src/components/forms/AddressForm";

function AddressesInner() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Address[]>([]);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const initialAdd: AddressFormValues = {
    type: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "LK",
    phone: "",
    isDefault: true,
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await listMyAddresses();
      setItems(data);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmitAdd = async (values: AddressFormValues) => {
    try {
      await createAddress({
        type: values.type as "SHIPPING" | "BILLING",
        line1: values.line1,
        line2: values.line2 || undefined,
        city: values.city,
        state: values.state || undefined,
        postalCode: values.postalCode || undefined,
        country: values.country.toUpperCase(),
        phone: values.phone || undefined,
        isDefault: !!values.isDefault,
        userId: "" as never, // will be ignored by backend
        id: "" as never,
        createdAt: "" as never,
        updatedAt: "" as never, // for TS convenience
      } as any);
      setAddOpen(false);
      await load();
      toast.success("Address added");
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to add address";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const onSubmitEdit = async (values: AddressFormValues) => {
    if (!editing) return;
    try {
      await updateAddress(editing.id, {
        type: (values.type || editing.type) as any,
        line1: values.line1,
        line2: values.line2 || null,
        city: values.city,
        state: values.state || null,
        postalCode: values.postalCode || null,
        country: values.country.toUpperCase(),
        phone: values.phone || null,
        isDefault: values.isDefault,
      });
      setEditOpen(false);
      setEditing(null);
      await load();
      toast.success("Address updated");
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Failed to update address";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const onDelete = async (a: Address) => {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(a.id);
      await load();
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const onMakeDefault = async (a: Address) => {
    try {
      await makeDefault(a.id);
      await load();
      toast.success("Default updated");
    } catch {
      toast.error("Failed to set default");
    }
  };

  const editInitial: AddressFormValues | null = useMemo(() => {
    if (!editing) return null;
    return {
      type: editing.type,
      line1: editing.line1,
      line2: editing.line2 ?? "",
      city: editing.city,
      state: editing.state ?? "",
      postalCode: editing.postalCode ?? "",
      country: editing.country,
      phone: editing.phone ?? "",
      isDefault: editing.isDefault,
    };
  }, [editing]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold">My Addresses</h1>
        <Button onClick={() => setAddOpen(true)}>Add address</Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">
          No addresses yet. Add your first address.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              onEdit={(addr) => {
                setEditing(addr);
                setEditOpen(true);
              }}
              onDelete={onDelete}
              onMakeDefault={onMakeDefault}
            />
          ))}
        </div>
      )}

      {/* Add modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add address"
        footer={null}
        size="md"
      >
        <AddressForm
          initialValues={initialAdd}
          onSubmit={onSubmitAdd}
          submitText="Add address"
          submittingText="Adding…"
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={editOpen && !!editing}
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        title="Edit address"
        footer={null}
        size="md"
      >
        {editInitial && (
          <AddressForm
            initialValues={editInitial}
            onSubmit={onSubmitEdit}
            submitText="Save changes"
            submittingText="Saving…"
          />
        )}
      </Modal>
    </div>
  );
}

export default function AddressesPage() {
  return (
    <Protected>
      <AddressesInner />
    </Protected>
  );
}
