import AdminOrderDetail from "@/src/components/admin/orders/AdminOrderDetail";
import Protected from "@/src/components/auth/Protected";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <Protected requiredRole="ADMIN">
      <AdminOrderDetail id={id} />
    </Protected>
  );
}
