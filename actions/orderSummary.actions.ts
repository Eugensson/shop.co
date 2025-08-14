"use server";

import { prisma } from "@/prisma/prisma";
import { startOfDay, endOfDay } from "date-fns";

export type OrderSummaryInput = {
  from: Date;
  to: Date;
};

export type RecentSale = {
  orderId: string;
  buyer: string;
  date: string;
  total: number;
};

export type OrderSummary = {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  totalProductsSold: number;
  newUsers: number;
  paidOrders: number;
  deliveredOrders: number;

  ordersByDay: { date: string; count: number }[];
  revenueByDay: { date: string; total: number }[];

  topProducts: {
    productId: string;
    name: string;
    imageUrl: string | null;
    quantitySold: number;
    totalRevenue: number;
  }[];

  topUsers: {
    userId: string;
    name: string | null;
    email: string | null;
    totalOrders: number;
    totalSpent: number;
  }[];

  topCategories: {
    categoryId: string;
    name: string;
    totalRevenue: number;
  }[];

  recentSales: RecentSale[];
};

export const getOrderSummary = async ({
  from,
  to,
}: OrderSummaryInput): Promise<OrderSummary> => {
  const start = startOfDay(from);
  const end = endOfDay(to);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start, lte: end } },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              images: {
                take: 1,
                where: { isMain: true },
                select: { url: true },
              },
            },
          },
        },
      },
      user: true,
    },
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const totalProductsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const paidOrders = orders.filter((o) => o.isPaid).length;
  const deliveredOrders = orders.filter((o) => o.isDelivered).length;

  const newUsers = await prisma.user.count({
    where: {
      createdAt: { gte: start, lte: end },
      isActive: false,
    },
  });

  const ordersByDayMap = new Map<string, number>();
  const revenueByDayMap = new Map<string, number>();

  for (const order of orders) {
    const dateStr = order.createdAt.toISOString().slice(0, 10);
    ordersByDayMap.set(dateStr, (ordersByDayMap.get(dateStr) || 0) + 1);
    revenueByDayMap.set(
      dateStr,
      (revenueByDayMap.get(dateStr) || 0) + order.totalPrice
    );
  }

  const ordersByDay = Array.from(ordersByDayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const revenueByDay = Array.from(revenueByDayMap.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const productMap = new Map<
    string,
    {
      name: string;
      imageUrl: string | null;
      quantity: number;
      revenue: number;
    }
  >();

  for (const order of orders) {
    for (const item of order.items) {
      const product = item.product;
      const productId = product.id;

      const entry = productMap.get(productId) || {
        name: product.name,
        imageUrl: product.images[0]?.url ?? null,
        quantity: 0,
        revenue: 0,
      };

      entry.quantity += item.quantity;
      entry.revenue += item.discountedPrice * item.quantity;
      productMap.set(productId, entry);
    }
  }

  const topProducts = Array.from(productMap.entries())
    .map(([id, data]) => ({
      productId: id,
      name: data.name,
      imageUrl: data.imageUrl,
      quantitySold: data.quantity,
      totalRevenue: data.revenue,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  const userMap = new Map<
    string,
    { name: string | null; email: string | null; orders: number; spent: number }
  >();

  for (const order of orders) {
    const userId = order.user.id;
    const entry = userMap.get(userId) || {
      name: order.user.name ?? null,
      email: order.user.email ?? null,
      orders: 0,
      spent: 0,
    };
    entry.orders += 1;
    entry.spent += order.totalPrice;
    userMap.set(userId, entry);
  }

  const topUsers = Array.from(userMap.entries())
    .map(([id, data]) => ({
      userId: id,
      name: data.name,
      email: data.email,
      totalOrders: data.orders,
      totalSpent: data.spent,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  const categoryMap = new Map<string, { name: string; totalRevenue: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const category = item.product.category;
      if (!category) continue;

      const categoryId = category.id;
      const entry = categoryMap.get(categoryId) || {
        name: category.name,
        totalRevenue: 0,
      };
      entry.totalRevenue += item.discountedPrice * item.quantity;
      categoryMap.set(categoryId, entry);
    }
  }

  const topCategories = Array.from(categoryMap.entries())
    .map(([id, data]) => ({
      categoryId: id,
      name: data.name,
      totalRevenue: data.totalRevenue,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const recentSales: RecentSale[] = orders
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)
    .map((order) => ({
      orderId: order.id,
      buyer: order.user.name ?? order.user.email ?? "Гість",
      date: order.createdAt.toISOString().slice(0, 10),
      total: order.totalPrice,
    }));

  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    totalProductsSold,
    paidOrders,
    deliveredOrders,
    newUsers,
    ordersByDay,
    revenueByDay,
    topProducts,
    topUsers,
    topCategories,
    recentSales,
  };
};
