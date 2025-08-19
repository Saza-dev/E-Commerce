"use client";

import { updateVariant } from "@/src/lib/api/products";
import { useState } from "react";
import toast from "react-hot-toast";
import VariantForm from "./VariantForm";
import { deleteVariant, Variant } from "@/src/lib/api/variants";
import AddVariant from "./AddVariants";

export default function VariantsManager({
  productId,
  variants,
}: {
  productId: number;
  variants: Variant[];
}) {
  const [variantList, setVariantList] = useState(variants);

  const handleUpdate = async (
    productId: number,
    variantId: number,
    data: {
      size?: string;
      color?: string;
      price?: number;
      quantity?: number;
      status?: "IN_STOCK" | "PRE_ORDER" | "OUT_OF_STOCK";
      images?: string[];
    }
  ) => {
    try {
      await updateVariant(productId, variantId, data);
      toast.success("Variant updated");
    } catch {
      toast.error("Failed to update variant");
    }
  };

  const handleDelete = async (variantId: number) => {
    try {
      await deleteVariant(variantId);
      setVariantList((prev) => prev.filter((v) => v.id !== variantId));
      toast.success("Variant deleted");
    } catch {
      toast.error("Failed to delete variant");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Variants</h2>
      {variantList.map((variant) => (
        <VariantForm
          key={variant.id}
          variant={variant}
          onUpdate={handleUpdate}
          productId={productId}
          onDelete={handleDelete}
        />
      ))}

      <AddVariant productId={productId} />
    </div>
  );
}
