
import AdminOrdersTable from "@/src/components/admin/orders/AdminOrdersTable";
import Protected from "@/src/components/auth/Protected";

export default function AdminOrdersPage() {
  return (
    <Protected requiredRole="ADMIN">
      <div className="mx-auto max-w-5xl">
        <AdminOrdersTable/>
      </div>
    </Protected>
  );
}
