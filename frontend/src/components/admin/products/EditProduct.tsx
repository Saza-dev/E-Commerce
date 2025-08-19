import type { Product } from "@/src/lib/api/products";
import ProductInfoForm from "./Edit/ProductInfoForm";
import VariantsManager from "./Edit/VariantsManager";

export default function EditProduct({ product }: { product: Product }) {
  return (
    <div className="space-y-8">
      {/* Section 1: Product Info */}
      <ProductInfoForm product={product} />

      {/* Section 2: Variants */}
      <VariantsManager productId={product.id} variants={product.variants} />
    </div>
  );
}
