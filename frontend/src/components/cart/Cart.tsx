"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/button";
import {
  CartItem,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/src/lib/api/cart";
import { useRouter } from "next/navigation";

export default function Cart({ userId }: { userId: string }) {
  const router = useRouter();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await updateCartItem(userId, { itemId, quantity });
      await fetchCart();
      toast.success("Item Updated");
    } catch {
      toast.error("Updating Failed");
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await deleteCartItem(userId, { itemId });
      await fetchCart();
      toast.success("Item Removed");
    } catch {
      toast.error("Removing Failed");
    }
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.quantity * (item.variant?.price ?? 0),
    0
  );

  const goToCheckout = () => {
    // /checkout uses JWT to get user & lets them pick an address
    router.push(`/checkout/${userId}`);
  };

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="p-6 w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-[30px] font-[500] mb-16">Your Cart</h1>
      {items.length === 0 && <p>Cart is empty.</p>}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex w-full max-w-5xl justify-between items-center mb-4 border-b pb-2"
        >
          <div className="w-[200px]">
            <img
              src={item.variant?.images?.[0]?.url ?? "/placeholder.png"}
              alt={item.variant?.color ?? "No color"}
              width={100}
              height={100}
            />
          </div>
          <div>
            <div className="font-[600]">{item.product?.name}</div>
            <div className="flex gap-2 mt-2 text-gray-500">
              <span className="px-3 py-1 border text-[12px] rounded-md font-medium bg-gray-100">
                {item.variant?.size}
              </span>
            </div>
            <div className="text-gray-500 text-[12px]">
              {item.variant?.color}
            </div>
            <div className="text-[14px] font-[700]">
              LKR {item.variant?.price}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)
              }
              className="bg-gray-200 w-10 h-10 text-[20px] font-[700] rounded hover:bg-gray-300"
            >
              -
            </button>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, parseInt(e.target.value) || 1)
              }
              className="h-10 w-16 pl-4 border rounded text-center"
            />

            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="bg-gray-200 w-10 h-10 text-[20px] font-[700] rounded hover:bg-gray-300"
            >
              +
            </button>

            <button
              onClick={() => removeItem(item.id)}
              className="bg-red-600 text-white w-[90px] h-10 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex w-full max-w-5xl justify-end">
        <div className="flex flex-col gap-5 mt-10">
          <div className="flex gap-4 items-center">
            <h2 className="text-xl font-[500]">Total :</h2>
            <h2 className="text-[14px] font-[500] text-gray-600">
              LKR {totalPrice.toFixed(2)}
            </h2>
          </div>

          {/* Pick ONE of these buttons */}
          <div className="flex gap-3">
            {/* A) Route to checkout page (address selection) */}
            <Button onClick={goToCheckout} className="w-[150px] h-[50px]">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
