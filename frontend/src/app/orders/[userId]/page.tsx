import Protected from "@/src/components/auth/Protected";
import Orders from "@/src/components/orders/Orders";

interface PageProps {
  params: { userId: string };
}

export default async function MyOrdersPage({ params }: PageProps) {
  const { userId } = await params;

  return (
    <Protected>
      <Orders userId={userId} />;
    </Protected>
  );
}
