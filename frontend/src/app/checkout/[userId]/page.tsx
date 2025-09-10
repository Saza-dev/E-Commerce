import Protected from "@/src/components/auth/Protected";
import Checkout from "@/src/components/checkout/Checkout";

interface PageProps {
  params: { userId: string };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { userId } = await params;

  return (
    <Protected>
      <Checkout userId={userId} />;
    </Protected>
  );
}
