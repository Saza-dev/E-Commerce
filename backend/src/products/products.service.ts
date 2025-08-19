import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateVariantDto } from 'src/variants/dtos/update-variant.dto';

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
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
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
}
