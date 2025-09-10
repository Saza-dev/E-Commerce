import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PlaceOrderDto } from './dto/place-order.dto';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async placeOrder(dto: PlaceOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: dto.userId },
        include: {
          items: {
            include: { variant: true, product: true },
          },
        },
      });
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const address = await tx.address.findFirst({
        where: { id: dto.addressId, userId: dto.userId },
      });
      if (!address) {
        throw new NotFoundException('Address not found');
      }

      let itemsTotal = 0;
      for (const ci of cart.items) {
        if (ci.variant.quantity < ci.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${ci.product.name} (${ci.variant.color}/${ci.variant.size})`,
          );
        }
        itemsTotal += ci.variant.price * ci.quantity;
      }
      const shippingFee = round2(dto.shippingFee ?? 0);
      const discount = round2(dto.discount ?? 0);
      const itemsTotalRounded = round2(itemsTotal);
      const totalAmount = round2(
        Math.max(0, itemsTotalRounded + shippingFee - discount),
      );

      const snapshot = await tx.addressSnapshot.create({
        data: {
          userId: address.userId,
          originalAddressId: address.id,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone,
        },
      });

      const order = await tx.order.create({
        data: {
          userId: dto.userId,
          status: OrderStatus.PROCESSING,
          paymentMethod: PaymentMethod.CARD,
          paymentRef: dto.paymentRef ?? null,
          itemsTotal: itemsTotalRounded,
          shippingFee,
          discount,
          totalAmount,
          paidAmount: totalAmount,
          paidAt: new Date(),
          shippingAddressId: snapshot.id,
          items: {
            create: cart.items.map((ci) => ({
              productId: ci.productId,
              variantId: ci.variantId,
              quantity: ci.quantity,
              unitPrice: ci.variant.price,
              lineTotal: round2(ci.variant.price * ci.quantity),
              productName: ci.product.name,
              variantSize: ci.variant.size,
              variantColor: ci.variant.color,
            })),
          },
        },
        include: { items: true, shippingAddress: true },
      });

      for (const ci of cart.items) {
        await tx.productVariant.update({
          where: { id: ci.variantId },
          data: { quantity: { decrement: ci.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  }

  async getOrderById(id: string, userId?: string) {
    const where = userId ? { id, userId } : { id };
    const order = await this.prisma.order.findFirst({
      where,
      include: { items: true, shippingAddress: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async listOrdersForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  // --------------------------- admin methods -------------------------

  async adminListOrders(params: {
    status?: OrderStatus;
    userId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize =
      params.pageSize && params.pageSize > 0 ? params.pageSize : 20;
    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.userId) where.userId = params.userId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          shippingAddress: true,
          user: { select: { email: true, name: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async adminGetOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        shippingAddress: true,
        user: { select: { email: true, name: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async adminUpdateOrderStatus(id: string, nextStatus: OrderStatus) {
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!current) throw new NotFoundException('Order not found');

      if (current.status === nextStatus) return current;

      // Restock if moving to CANCELLED from a non-cancelled state
      if (
        nextStatus === OrderStatus.CANCELLED &&
        current.status !== OrderStatus.CANCELLED
      ) {
        for (const it of current.items) {
          await tx.productVariant.update({
            where: { id: it.variantId },
            data: { quantity: { increment: it.quantity } },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id },
        data: { status: nextStatus },
        include: { items: true, shippingAddress: true },
      });

      return updated;
    });
  }
}
