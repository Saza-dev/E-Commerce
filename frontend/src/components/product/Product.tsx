"use client";

import { listProductBySlug, type Product } from "@/src/lib/api/products";
import type { Variant } from "@/src/lib/api/variants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddToCartButton from "../cart/AddToCartButton";
import { useAuth } from "@/src/contexts/AuthContext";
import Button from "../ui/button";

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
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${selectedVariant.price}</p>
      <p>Size: {selectedVariant.size}</p>
      <p>Status: {selectedVariant.status}</p>
      <p>Quantity: {selectedVariant.quantity}</p>

      <div>
        <h3>Choose a color:</h3>
        {uniqueColors.map((color) => (
          <Button
            key={color}
            onClick={() => setSelectedColor(color)}
          >
            {color}
          </Button>
        ))}
      </div>

      {selectedColor && (
        <div>
          <h3>Choose a size:</h3>
          {uniqueSizes.map((size) => (
            <Button
              key={size}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      )}

      <div>
        <h3>Images:</h3>
        {selectedVariant.images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={selectedVariant.color}
            width={100}
            height={100}
          />
        ))}
      </div>

      <div>
        <h3>Quantity:</h3>
        <input
          type="number"
          min={1}
          max={selectedVariant.quantity}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: "60px", marginRight: "8px" }}
        />
      </div>

      <div>
        <AddToCartButton
          userId={userId}
          productId={product.id}
          variantId={selectedVariant.id}
          quantity={quantity}
        />
      </div>
    </div>
  );
}
