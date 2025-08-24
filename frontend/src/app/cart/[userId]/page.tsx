import Protected from "@/src/components/auth/Protected";
import Cart from "@/src/components/cart/Cart";

interface PageProps {
  params: { userId: string };
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params;

  return (
    <Protected>
      <Cart userId={userId} />;
    </Protected>
  );
}
