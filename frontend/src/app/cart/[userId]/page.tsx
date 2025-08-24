import Cart from "@/src/components/cart/Cart";

interface PageProps {
  params: { userId: string };
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params;

  return <Cart userId={userId} />;
}
