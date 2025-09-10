import Protected from "@/src/components/auth/Protected";
import OrderDetails from "@/src/components/orders/OrderDetails";

interface PageProps {
  params: { orderId: string };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <Protected>
      <OrderDetails orderId={orderId} />
    </Protected>
  );
}
