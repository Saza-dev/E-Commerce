import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateVariantDto } from './dtos/update-variant.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        categoryId: dto.categoryId,
        variants: {
          create: dto.variants.map((v) => ({
            size: v.size,
            color: v.color,
            price: v.price,
            quantity: v.quantity,
            status: v.status || 'IN_STOCK',
            images: { create: v.images.map((url) => ({ url })) },
          })),
        },
      },
      include: {
        variants: { include: { images: true } },
      },
    });
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
        categoryId: dto.categoryId,
      },
    });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  async getAllProducts() {
    return this.prisma.product.findMany({
      include: { variants: { include: { images: true } }, category: true },
    });
  }

  async getProducts(filters: any) {
    const { category, size, color, minPrice, maxPrice } = filters;
    return this.prisma.product.findMany({
      where: {
        category: category ? { slug: category } : undefined,
        variants: {
          some: {
            size: size || undefined,
            color: color || undefined,
            price: {
              gte: minPrice || undefined,
              lte: maxPrice || undefined,
            },
          },
        },
      },
      include: { variants: { include: { images: true } }, category: true },
    });
  }

  async getProductBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { variants: { include: { images: true } }, category: true },
    });
  }

  async getVariantImages(variantId: number) {
    return this.prisma.productImage.findMany({ where: { variantId } });
  }

  async updateVariant(
    productId: number,
    variantId: number,
    dto: UpdateVariantDto,
  ) {
    // Optional: verify the variant belongs to the product
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.productId !== productId) {
      throw new Error('Variant not found for this product');
    }

    // Update the variant
    const updatedVariant = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        size: dto.size,
        color: dto.color,
        price: dto.price,
        quantity: dto.quantity,
        status: dto.status,
        images: dto.images
          ? {
              deleteMany: {}, // remove old images
              create: dto.images.map((url) => ({ url })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return updatedVariant;
  }
}
