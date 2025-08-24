import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    return cart;
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    let cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    // check if item already exists
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId: dto.variantId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (dto.quantity || 1) },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        variantId: dto.variantId,
        quantity: dto.quantity || 1,
      },
    });
  }

  async updateCart(userId: string, dto: UpdateCartDto) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');
    return this.prisma.cartItem.update({
      where: { id: dto.itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeFromCart(userId: string, dto: RemoveFromCartDto) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    return this.prisma.cartItem.delete({ where: { id: dto.itemId } });
  }
}
