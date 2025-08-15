import { PrismaClient, StockStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // --- Categories ---
  const menCategory = await prisma.category.create({
    data: { name: 'Men', slug: 'men' },
  });

  const womenCategory = await prisma.category.create({
    data: { name: 'Women', slug: 'women' },
  });

  const shirtsCategory = await prisma.category.create({
    data: {
      name: 'Shirts',
      slug: 'shirts',
      parentId: menCategory.id, // can change to womenCategory.id for women's shirts
    },
  });

  // --- Products ---
  const product1 = await prisma.product.create({
    data: {
      name: 'Classic Cotton Shirt',
      description: 'Comfortable cotton shirt for daily wear.',
      slug: 'classic-cotton-shirt',
      categoryId: shirtsCategory.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Slim Fit Formal Shirt',
      description: 'Perfect for office and formal occasions.',
      slug: 'slim-fit-formal-shirt',
      categoryId: shirtsCategory.id,
    },
  });

  // --- Product Variants ---
  const variant1 = await prisma.productVariant.create({
    data: {
      productId: product1.id,
      size: 'M',
      color: 'Blue',
      price: 25.99,
      quantity: 50,
      status: StockStatus.IN_STOCK,
    },
  });

  const variant2 = await prisma.productVariant.create({
    data: {
      productId: product1.id,
      size: 'L',
      color: 'Red',
      price: 27.99,
      quantity: 20,
      status: StockStatus.PRE_ORDER,
    },
  });

  const variant3 = await prisma.productVariant.create({
    data: {
      productId: product2.id,
      size: 'M',
      color: 'White',
      price: 35.5,
      quantity: 0,
      status: StockStatus.OUT_OF_STOCK,
    },
  });

  // --- Product Images ---
  await prisma.productImage.createMany({
    data: [
      {
        variantId: variant1.id,
        url: 'https://example.com/images/shirt1-blue-front.jpg',
      },
      {
        variantId: variant1.id,
        url: 'https://example.com/images/shirt1-blue-back.jpg',
      },
      {
        variantId: variant2.id,
        url: 'https://example.com/images/shirt1-red-front.jpg',
      },
      {
        variantId: variant2.id,
        url: 'https://example.com/images/shirt1-red-back.jpg',
      },
      {
        variantId: variant3.id,
        url: 'https://example.com/images/shirt2-white-front.jpg',
      },
      {
        variantId: variant3.id,
        url: 'https://example.com/images/shirt2-white-back.jpg',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
