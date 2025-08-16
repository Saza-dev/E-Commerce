import Protected from "@/src/components/auth/Protected";
import AdminDashboard from "@/src/components/admin/AdminDashboard";

export default function ProfilePage() {
  return (
    <Protected>
      <AdminDashboard />
    </Protected>
  );
}