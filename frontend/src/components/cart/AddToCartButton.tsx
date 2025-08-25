"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { addToCart } from "@/src/lib/api/cart";

interface AddToCartButtonProps {
  userId?: string;
  productId: number;
  variantId: number;
  quantity: number;
  disabled?: boolean;
}

export default function AddToCartButton({
  productId,
  variantId,
  userId,
  quantity,
  disabled,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!userId) {
      toast.error("You must be logged in to add items to cart");
      return;
    }
    setLoading(true);
    try {
      await addToCart(userId, { productId, variantId, quantity });
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded 
    ${
      disabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
    >
      {disabled ? "Out of Stock" : loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
