import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateVariantDto } from './dtos/create-variant.dto';
import { UpdateVariantDto } from './dtos/update-variant.dto';

@Injectable()
export class VariantsService {
  constructor(private readonly prisma: PrismaService) {}

  async createVariant(dto: CreateVariantDto) {
    return this.prisma.productVariant.create({
      data: {
        size: dto.size,
        color: dto.color,
        price: dto.price,
        quantity: dto.quantity,
        productId: dto.productId,
        status: dto.status || 'IN_STOCK',
        images: { create: dto.images.map((url) => ({ url })) },
      },
      include: {
        images: true,
      },
    });
  }

  async updateVariant(
    productId: number,
    variantId: number,
    dto: UpdateVariantDto,
  ) {
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

  async deleteVariant(id: number) {
    await this.prisma.productVariant.delete({ where: { id } });
    return { success: true };
  }
}
