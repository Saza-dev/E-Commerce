import AdminProductsTable from "@/src/components/admin/products/AdminProductsTable";
import Protected from "@/src/components/auth/Protected";

export default function AdminUsersPage() {
  return (
    <Protected requiredRole="ADMIN">
      <div className="mx-auto max-w-5xl">
        <AdminProductsTable/>
      </div>
    </Protected>
  );
}
