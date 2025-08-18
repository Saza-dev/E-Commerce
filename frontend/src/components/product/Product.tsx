"use client";

import {
  listProductBySlug,
  type Variant,
  type Product,
} from "@/src/lib/api/products";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PageProps {
  slug: string;
}

export default function Product({ slug }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null); 

  useEffect(() => {
    (async () => {
      try {
        const products = await listProductBySlug(slug);
        setProduct(products);
        setSelectedVariant(products.variants[0]); //default variant
      } catch {
        toast.error("Failed to load Product");
      }
    })();
  }, [slug]);

  if (!product || !selectedVariant) return <p>Loading...</p>;

  const handleVariantSelect = (color: string) => {
    const variant = product.variants.find((v) => v.color === color);
    if (variant) setSelectedVariant(variant);
  };

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
        {product.variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => handleVariantSelect(variant.color)}
            style={{
              marginRight: "8px",
              backgroundColor: variant.color.toLowerCase(),
              color: "white",
              padding: "5px 10px",
              border:
                selectedVariant.color === variant.color
                  ? "2px solid black"
                  : "none",
            }}
          >
            {variant.color}
          </button>
        ))}
      </div>

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
    </div>
  );
}
