"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { PaymentMethod, DeliveryMethod } from "@prisma/client";

import { prisma } from "@/prisma/prisma";
import { currentUser } from "@/lib/auth";
import { handleUnknownError } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/lib/mail";

import { createOrderSchema, editOrderSchema } from "@/schemas";
import { DELIVERY_METHOD_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/constants";

export const createOrder = async (formData: FormData) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    const userId = user.id;

    const itemsJson = formData.get("items");
    const deliveryAddressJson = formData.get("deliveryAddress");
    const deliveryMethodRaw = formData.get("deliveryMethod");
    const paymentMethodRaw = formData.get("paymentMethod");

    if (
      !itemsJson ||
      !deliveryAddressJson ||
      typeof deliveryMethodRaw !== "string" ||
      typeof paymentMethodRaw !== "string"
    ) {
      return { error: "Missing order fields" };
    }

    const isValidPaymentMethod = (
      Object.values(PaymentMethod) as string[]
    ).includes(paymentMethodRaw);

    const isValidDeliveryMethod = (
      Object.values(DeliveryMethod) as string[]
    ).includes(deliveryMethodRaw);

    if (!isValidPaymentMethod || !isValidDeliveryMethod) {
      return { error: "Invalid payment or delivery method" };
    }

    const paymentMethod = paymentMethodRaw as PaymentMethod;
    const deliveryMethod = deliveryMethodRaw as DeliveryMethod;

    const parsed = createOrderSchema.safeParse({
      items: JSON.parse(itemsJson as string),
      deliveryAddress: JSON.parse(deliveryAddressJson as string),
      deliveryMethod,
      paymentMethod,
    });

    if (!parsed.success) {
      return { error: "Invalid order data" };
    }

    const { items, deliveryAddress } = parsed.data;

    const productIds = items.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: { select: { name: true } },
        images: {
          where: { isMain: true },
          select: { url: true, publicId: true },
        },
        variants: {
          select: {
            id: true,
            colorId: true,
            sizeId: true,
            color: { select: { name: true } },
            size: { select: { name: true } },
            quantity: true,
            price: true,
            discountedPrice: true,
          },
        },
      },
    });

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error(`Product not found: ${item.productId}`);

      const variant = product.variants.find(
        (v) =>
          v.color.name.toLowerCase() === item.color.toLowerCase() &&
          v.size.name.toLowerCase() === item.size.toLowerCase()
      );

      if (!variant) {
        throw new Error(
          `Variant not found for product ${item.productId} (${item.color}/${item.size})`
        );
      }

      if (variant.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }

      return {
        variantId: variant.id,
        productId: item.productId,
        productName: product.name,
        productSlug: product.slug,
        brandName: product.brand.name,
        color: item.color,
        colorId: variant.colorId,
        size: item.size,
        sizeId: variant.sizeId,
        quantity: item.quantity,
        price: variant.price,
        discountedPrice: variant.discountedPrice,
        imagePublicId: product.images[0]?.publicId || "/placeholder.jpg",
        imageUrl: product.images[0]?.url || "/placeholder.jpg",
      };
    });

    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.discountedPrice * item.quantity,
      0
    );

    const newOrder = await prisma.$transaction(async (tx) => {
      const newAddress = await tx.deliveryAddress.create({
        data: deliveryAddress,
      });

      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          paymentMethod,
          deliveryMethod,
          deliveryAddressId: newAddress.id,
          items: {
            create: orderItems.map(({ variantId, ...rest }) => ({
              ...rest,
              colorId: rest.colorId,
              sizeId: rest.sizeId,
            })),
          },
        },
        include: {
          items: true,
          deliveryAddress: true,
        },
      });

      await Promise.all(
        orderItems.map((item) =>
          tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          })
        )
      );

      return createdOrder;
    });

    if (user.email && newOrder && newOrder.deliveryAddress) {
      await sendOrderConfirmationEmail(user.email, {
        orderId: newOrder.id,
        items: newOrder.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          quantity: item.quantity,
          price: item.discountedPrice,
          imageUrl: item.imageUrl || "",
        })),
        totalPrice: newOrder.totalPrice,
        deliveryAddress: newOrder.deliveryAddress,
        paymentMethod: PAYMENT_METHOD_OPTIONS[newOrder.paymentMethod],
        deliveryMethod: DELIVERY_METHOD_OPTIONS[newOrder.deliveryMethod],
      });
    }

    revalidatePath("/orders");
    revalidatePath("/order-history");

    return { success: "Order created" };
  } catch (error) {
    return handleUnknownError(error);
  }
};

export const editOrder = async (values: z.infer<typeof editOrderSchema>) => {
  try {
    const validated = editOrderSchema.safeParse(values);

    if (!validated.success) {
      return { error: "Invalid order data!" };
    }

    const { orderId, isPaid, isDelivered, paidAt, deliveredAt } =
      validated.data;

    if (!orderId) {
      return { error: "Missing order ID!" };
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return { error: "Order not found!" };
    }

    const updateData: Record<string, any> = { isRead: true };

    if (typeof isPaid === "boolean") {
      updateData.isPaid = isPaid;
      updateData.paidAt = isPaid ? (paidAt ?? new Date()) : null;
    } else if (paidAt !== undefined) {
      updateData.paidAt = paidAt;
      updateData.isPaid = true;
    }

    if (typeof isDelivered === "boolean") {
      updateData.isDelivered = isDelivered;
      updateData.deliveredAt = isDelivered ? (deliveredAt ?? new Date()) : null;
    } else if (deliveredAt !== undefined) {
      updateData.deliveredAt = deliveredAt;
      updateData.isDelivered = true;
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    revalidatePath(`/orders/${orderId}/edit`);

    return { success: "Order updated!" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    if (!orderId) return { error: "Order ID is required!" };

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) return { error: "Order not found!" };
    if (order.isPaid) return { error: "Paid order can't be deleted!" };

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.productVariant.update({
          where: {
            productId_colorId_sizeId: {
              productId: item.productId,
              colorId: item.colorId,
              sizeId: item.sizeId,
            },
          },
          data: {
            quantity: { increment: item.quantity },
          },
        });
      }

      await tx.orderItem.deleteMany({
        where: { orderId },
      });

      await tx.order.delete({
        where: { id: orderId },
      });
    });

    revalidatePath("/orders");
    return { success: "Order deleted and products returned to stock." };
  } catch (error) {
    return handleUnknownError(error);
  }
};
