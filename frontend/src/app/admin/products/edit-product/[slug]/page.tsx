import EditProduct from "@/src/components/admin/products/EditProduct";
import Protected from "@/src/components/auth/Protected";
import { listProductBySlug } from "@/src/lib/api/products";

interface PageProps {
  params: { slug: string };
}

export default async function page({ params }: PageProps) {
  const { slug } = await params;
  const product = await listProductBySlug(slug);

  return (
    <Protected requiredRole="ADMIN">
      <div className="mx-auto max-w-5xl">
        <EditProduct product={product} />
      </div>
    </Protected>
  );
}
