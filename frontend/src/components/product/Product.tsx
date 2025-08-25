"use client";

import { listProductBySlug, type Product } from "@/src/lib/api/products";
import type { Variant } from "@/src/lib/api/variants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddToCartButton from "../cart/AddToCartButton";
import { useAuth } from "@/src/contexts/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface PageProps {
  slug: string;
}

export default function Product({ slug }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    (async () => {
      try {
        const products = await listProductBySlug(slug);
        setProduct(products);
        const firstVariant = products.variants?.[0] || null;
        setSelectedVariant(firstVariant);
        setSelectedColor(firstVariant?.color || null);
        setSelectedSize(firstVariant?.size || null);
      } catch {
        toast.error("Failed to load Product");
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const variant = product.variants?.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );
      if (variant) setSelectedVariant(variant);
    }
  }, [selectedColor, selectedSize, product]);

  const uniqueColors = [...new Set(product?.variants?.map((v) => v.color))];

  const uniqueSizes = [
    ...new Set(
      product?.variants
        ?.filter((v) => v.color === selectedColor)
        .map((v) => v.size)
    ),
  ];

  if (!product || !selectedVariant) return <p>Loading...</p>;

  return (
    <div className="flex justify-evenly mt-10">
      <div className="w-[500px]">
        <Swiper spaceBetween={10} slidesPerView={1} className="rounded-lg">
          {selectedVariant.images.map((img) => (
            <SwiperSlide key={img.id}>
              <img
                src={img.url}
                alt={selectedVariant.color}
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="w-1/2 flex flex-col gap-4">
        <h1 className="text-[30px] font-[500]">{product.name}</h1>
        <p className="w-[800px]">{product.description}</p>
        <p className="font-[700]">Price: {selectedVariant.price} LKR</p>
        <p
          className={`font-[700] ${
            selectedVariant.status === "OUT_OF_STOCK"
              ? "text-red-500"
              : "text-black"
          }`}
        >
          Status: {selectedVariant.status}
        </p>

        <p className="font-[700]">Quantity: {selectedVariant.quantity}</p>

        <div className="flex gap-5 items-center">
          <h3 className="font-[700]">Choose a color:</h3>
          {uniqueColors.map((color) => (
            <button
              className={`border rounded-[10px] w-[80px] h-[40px] 
    ${
      selectedColor === color
        ? "border-black text-black"
        : "border-gray-400 text-gray-400"
    }`}
              key={color}
              onClick={() => setSelectedColor(color)}
            >
              {color}
            </button>
          ))}
        </div>

        {selectedColor && (
          <div className="flex gap-5 items-center ">
            <h3 className="font-[700] mr-[10px]">Choose a size:</h3>
            {uniqueSizes.map((size) => (
              <button
                className={`border rounded-[10px] w-[80px] h-[40px] 
    ${
      selectedSize === size
        ? "border-black text-black"
        : "border-gray-400 text-gray-400"
    }`}
                key={size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-10 items-center">
          <h3 className="font-[700]">Quantity:</h3>
          <div className="flex items-center gap-2">
            {/* Minus button */}
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-[40px] h-[40px] border border-gray-400 rounded text-lg font-bold"
            >
              -
            </button>

            {/* Input field */}
            <input
              type="number"
              min={1}
              max={selectedVariant.quantity}
              value={quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= selectedVariant.quantity) {
                  setQuantity(value);
                }
              }}
              className="w-[80px] h-[40px] pl-4 text-center  border border-gray-300 rounded"
            />

            {/* Plus button */}
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.min(selectedVariant.quantity, q + 1))
              }
              className="w-[40px] h-[40px] border border-gray-400 rounded text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-5">
          <AddToCartButton
            userId={userId}
            productId={product.id}
            variantId={selectedVariant.id}
            quantity={quantity}
            disabled={selectedVariant.status === "OUT_OF_STOCK"}
          />
        </div>
      </div>
    </div>
  );
}
