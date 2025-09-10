import { Injectable } from '@nestjs/common';

import { OrderStatus } from '@prisma/client';
import { addDays, startOfDay, subDays } from 'date-fns';
import { PrismaService } from 'src/common/prisma/prisma.service';

type Range = { from: Date; to: Date };

function resolveRange(from?: string, to?: string, fallbackDays = 30): Range {
  const end = to ? new Date(to) : new Date();
  const start = from ? new Date(from) : subDays(end, fallbackDays - 1);
  return { from: startOfDay(start), to: addDays(startOfDay(end), 1) }; // to is exclusive
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // --- KPIs for tiles ---
  async overview(from?: string, to?: string) {
    const r = resolveRange(from, to, 30);
    const activeStatuses = [OrderStatus.PROCESSING, OrderStatus.FULFILLED];

    const [ordersAgg, itemsAgg, distinctUsers, newUsers, repeatUsers] =
      await Promise.all([
        this.prisma.order.aggregate({
          _sum: { totalAmount: true, paidAmount: true },
          _count: true,
          where: {
            createdAt: { gte: r.from, lt: r.to },
            status: { in: activeStatuses },
          },
        }),
        this.prisma.orderItem.aggregate({
          _sum: { quantity: true },
          where: {
            order: {
              createdAt: { gte: r.from, lt: r.to },
              status: { in: activeStatuses },
            },
          },
        }),
        this.prisma.order.findMany({
          where: {
            createdAt: { gte: r.from, lt: r.to },
            status: { in: activeStatuses },
          },
          select: { userId: true },
          distinct: ['userId'],
        }),
        this.prisma.user.count({
          where: { createdAt: { gte: r.from, lt: r.to } },
        }),
        // repeat rate = users in range who have 2+ lifetime orders
        this.prisma.order.groupBy({
          by: ['userId'],
          where: {
            createdAt: { gte: r.from, lt: r.to },
            status: { in: activeStatuses },
          },
          _count: { userId: true },
        }),
      ]);

    const ordersCount = ordersAgg._count ?? 0;
    const revenue = ordersAgg._sum?.paidAmount ?? 0; // or totalAmount depending on your definition
    const itemsSold = itemsAgg._sum?.quantity ?? 0;
    const distinctBuyerCount = distinctUsers.length;
    const aov = ordersCount ? revenue / ordersCount : 0;

    // compute repeat in range using lifetime counts:
    // Count users (in the range) whose LIFETIME orders >= 2
    const userIds = repeatUsers.map((u) => u.userId);
    const lifetimeCounts = await this.prisma.order.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds }, status: { in: activeStatuses } },
      _count: { userId: true },
    });
    const repeatInRange = lifetimeCounts.filter(
      (x) => (x._count.userId ?? 0) >= 2,
    ).length;
    const repeatRate = distinctBuyerCount
      ? repeatInRange / distinctBuyerCount
      : 0;

    return {
      range: r,
      revenue,
      ordersCount,
      itemsSold,
      aov,
      newUsers,
      distinctBuyerCount,
      repeatRate,
    };
  }

  // --- Time series revenue by day ---
  async salesByDay(days = 30) {
    const r = resolveRange(undefined, undefined, days);
    const activeStatuses = [OrderStatus.PROCESSING, OrderStatus.FULFILLED];

    // fetch orders in range
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: r.from, lt: r.to },
        status: { in: activeStatuses },
      },
      select: { createdAt: true, paidAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    // bucket by YYYY-MM-DD
    const map = new Map<string, number>();
    for (let d = new Date(r.from); d < r.to; d = addDays(d, 1)) {
      map.set(d.toISOString().slice(0, 10), 0);
    }
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + (o.paidAmount ?? 0));
    }
    return Array.from(map, ([date, revenue]) => ({ date, revenue }));
  }

  // --- Revenue by Category ---
  async salesByCategory(from?: string, to?: string) {
    const r = resolveRange(from, to, 30);
    const activeStatuses = [OrderStatus.PROCESSING, OrderStatus.FULFILLED];

    const rows = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: { gte: r.from, lt: r.to },
          status: { in: activeStatuses },
        },
      },
      _sum: { lineTotal: true, quantity: true },
    });

    const productIds = rows.map((r) => r.productId);
    if (!productIds.length) return [];

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, categoryId: true },
    });
    const catIds = Array.from(new Set(products.map((p) => p.categoryId)));
    const cats = await this.prisma.category.findMany({
      where: { id: { in: catIds } },
      select: { id: true, name: true },
    });
    const catName = new Map(cats.map((c) => [c.id, c.name]));
    const productToCat = new Map(products.map((p) => [p.id, p.categoryId]));

    const agg = new Map<
      number,
      { categoryId: number; category: string; revenue: number; qty: number }
    >();
    for (const row of rows) {
      const catId = productToCat.get(row.productId)!;
      const key = catId;
      const prev = agg.get(key) ?? {
        categoryId: catId,
        category: catName.get(catId) ?? 'Unknown',
        revenue: 0,
        qty: 0,
      };
      prev.revenue += row._sum.lineTotal ?? 0;
      prev.qty += row._sum.quantity ?? 0;
      agg.set(key, prev);
    }
    return Array.from(agg.values()).sort((a, b) => b.revenue - a.revenue);
  }

  // --- Top Products ---
  // reports.service.ts
  async topProducts(limit: number | string = 10, from?: string, to?: string) {
    const n = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    const r = resolveRange(from, to, 30);
    const activeStatuses = [OrderStatus.PROCESSING, OrderStatus.FULFILLED];

    const rows = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: { gte: r.from, lt: r.to },
          status: { in: activeStatuses },
        },
      },
      _sum: { lineTotal: true, quantity: true },
      orderBy: { _sum: { lineTotal: 'desc' } },
      take: Number.isFinite(n) && n > 0 ? n : 10, // <-- number for Prisma
    });

    const products = await this.prisma.product.findMany({
      where: { id: { in: rows.map((r) => r.productId) } },
      select: { id: true, name: true },
    });
    const name = new Map(products.map((p) => [p.id, p.name]));
    return rows.map((r) => ({
      productId: r.productId,
      productName: name.get(r.productId) ?? `#${r.productId}`,
      revenue: r._sum.lineTotal ?? 0,
      qty: r._sum.quantity ?? 0,
    }));
  }

  // --- Order status breakdown (pie) ---
  async orderStatusBreakdown(from?: string, to?: string) {
    const r = resolveRange(from, to, 30);
    const groups = await this.prisma.order.groupBy({
      by: ['status'],
      where: { createdAt: { gte: r.from, lt: r.to } },
      _count: { _all: true },
    });
    return groups.map((g) => ({ status: g.status, count: g._count._all }));
  }

  // --- New users by week (bar) ---
  async newUsersByWeek(weeks = 12) {
    const r = resolveRange(undefined, undefined, weeks * 7);
    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: r.from, lt: r.to } },
      select: { createdAt: true },
    });
    // bucket by ISO week label YYYY-Www
    const bucket = new Map<string, number>();
    for (const u of users) {
      const d = u.createdAt;
      const y = d.getUTCFullYear();
      const firstThursday = new Date(Date.UTC(y, 0, 4));
      const week1 = startOfDay(firstThursday);
      const week = Math.ceil(
        ((d.getTime() - week1.getTime()) / 86400000 + week1.getUTCDay() + 1) /
          7,
      );
      const key = `${y}-W${String(week).padStart(2, '0')}`;
      bucket.set(key, (bucket.get(key) ?? 0) + 1);
    }
    return Array.from(bucket, ([week, count]) => ({ week, count })).sort(
      (a, b) => a.week.localeCompare(b.week),
    );
  }

  // --- Low stock (table tile) ---
  async lowStock(threshold = 5) {
    const variants = await this.prisma.productVariant.findMany({
      where: { quantity: { lte: threshold } },
      select: {
        id: true,
        productId: true,
        size: true,
        color: true,
        quantity: true,
        price: true,
        product: { select: { name: true } },
      },
      orderBy: [{ quantity: 'asc' }],
      take: 50,
    });
    return variants.map((v) => ({
      variantId: v.id,
      productId: v.productId,
      productName: v.product.name,
      size: v.size,
      color: v.color,
      quantity: v.quantity,
      price: v.price,
    }));
  }
}
