"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CartItem,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/src/lib/api/cart";
import toast from "react-hot-toast";
import Button from "../ui/button";

interface CartProps {
  userId: string;
}

export default function Cart({ userId }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await getCart(userId);
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateCartItem(userId, { itemId, quantity });
      fetchCart();
      toast.success("Item Updated");
    } catch (err) {
      toast.error("Updating Failed");
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await deleteCartItem(userId, { itemId });
      fetchCart();
      toast.success("Item Removed");
    } catch (err) {
      toast.error("Removing Failed");
    }
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.quantity * (item.variant?.price ?? 0),
    0
  );

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="p-6 w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Your Cart</h1>
      {items.length === 0 && <p>Cart is empty.</p>}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex w-full  max-w-5xl  justify-between items-center mb-4 border-b pb-2"
        >
          <div className="w-[200px]">
            <img
              key={item.variant?.id}
              src={item.variant?.images?.[0]?.url ?? "/placeholder.png"}
              alt={item.variant?.color ?? "No color"}
              width={100}
              height={100}
            />
          </div>
          <div>
            <p>{item.product?.name}</p>
            <p>
              Variant: {item.variant?.color}, {item.variant?.size}
            </p>
            <p>Price: ${item.variant?.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, parseInt(e.target.value))
              }
              className="w-16 border rounded p-1"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex w-full max-w-5xl justify-end">
        {" "}
        <div className="flex flex-col">
          <h2 className="text-xl mt-4">Total: ${totalPrice.toFixed(2)}</h2>
          <Button>CheckOut</Button>
        </div>
      </div>
    </div>
  );
}
