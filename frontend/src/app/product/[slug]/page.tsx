import Product from "@/src/components/product/Product";

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div>
      <Product slug={slug} />
    </div>
  );
}
