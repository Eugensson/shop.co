import Image from "next/image";
import type { Metadata } from "next";
import { ClipboardList, Info } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductPrice } from "@/components/product-price";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { prisma } from "@/prisma/prisma";
import { formatCurrency, cn } from "@/lib/utils";
import { DELIVERY_METHOD_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/constants";

export const metadata: Metadata = {
  title: "Order details",
  robots: {
    index: false,
    follow: true,
  },
};

interface OrderDetailsAdminPageProps {
  params: Promise<{ orderId: string }>;
}

const OrderDetailsAdminPage = async ({
  params,
}: OrderDetailsAdminPageProps) => {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: { id: true, email: true },
      },
      deliveryAddress: true,
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isMain: true },
                select: { url: true, publicId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    return (
      <section className="p-5">
        <p className="text-destructive font-medium">Order not found</p>
      </section>
    );
  }

  const totalItems = order.items?.reduce((a, c) => a + c.quantity, 0) ?? 0;

  return (
    <section className="p-5 grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-5">
      <Card className="px-3 py-5 h-fit">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
            <ClipboardList size={22} />
            Review Items
            <span className="text-muted-foreground">
              ({totalItems}&nbsp;{totalItems === 1 ? "product" : "products"})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-60 lg:h-90 pr-4">
            <Table>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="relative w-40 h-40 bg-[#f0eeed] rounded-xl overflow-hidden">
                        <Image
                          src={item.imageUrl ?? "/placeholder.jpg"}
                          alt={item.productName}
                          fill
                          sizes="(max-width: 768px) 100vw, 80px"
                          className="object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-primary">
                      <h2 className="text-lg font-bold mb-2">
                        {item.productName}
                      </h2>
                      <p className="lowercase">
                        brand: {item.brandName}; size: {item.size};
                      </p>
                      <p className="lowercase">
                        color: {item.color}; quantity: {item.quantity};
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary">
                      <ProductPrice
                        price={item.price}
                        discountedPrice={item.discountedPrice}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="px-3 py-5 flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
            <Info size={22} />
            Order Summary
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-3">
            <p>
              <span className="font-semibold text-primary">Order ID:</span>
              &nbsp;
              {order.id}
            </p>
            <p>
              <span className="font-semibold text-primary">Created At:</span>
              &nbsp;
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold text-primary">
                Payment Method:
              </span>
              &nbsp;
              {PAYMENT_METHOD_OPTIONS[order.paymentMethod]}
            </p>
            <p>
              <span className="font-semibold text-primary">
                Delivery Method:
              </span>
              &nbsp;
              {DELIVERY_METHOD_OPTIONS[order.deliveryMethod]}
            </p>
            <p>
              <span className="font-semibold text-primary">
                Payment Status:
              </span>
              &nbsp;
              <span
                className={cn(
                  "font-bold",
                  order.isPaid ? "text-green-600" : "text-destructive"
                )}
              >
                {order.isPaid ? "Paid" : "Not Paid"}
              </span>
            </p>
            <p>
              <span className="font-semibold text-primary">Paid At:</span>
              &nbsp;
              {order.isPaid && order.paidAt
                ? new Date(order?.paidAt).toLocaleString()
                : "-"}
            </p>
            <p>
              <span className="font-semibold text-primary">
                Delivery Status:
              </span>
              &nbsp;
              <span
                className={cn(
                  "font-bold",
                  order.isDelivered ? "text-green-600" : "text-destructive"
                )}
              >
                {order.isDelivered ? "Delivered" : "Not Delivered"}
              </span>
            </p>
            <p>
              <span className="font-semibold text-primary">Delivered At:</span>
              &nbsp;
              {order.isDelivered && order.deliveredAt
                ? new Date(order.deliveredAt).toLocaleString()
                : "-"}
            </p>
          </div>
          <Separator />
          <div className="space-y-3 text-sm">
            <h3 className="text-lg font-semibold">Delivery Address</h3>
            <p>
              {order?.deliveryAddress?.firstName}&nbsp;
              {order?.deliveryAddress?.lastName}
            </p>
            <p>{order?.deliveryAddress?.address}</p>
            <p>
              {order?.deliveryAddress?.city}, {order?.deliveryAddress?.state}
              &nbsp;
              {order?.deliveryAddress?.postalCode}
            </p>
            <p>{order?.deliveryAddress?.country}</p>
            <p>Email: {order?.deliveryAddress?.email}</p>
            <p>Phone: {order?.deliveryAddress?.phone}</p>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total Price:</span>
            <span>{formatCurrency(order.totalPrice)}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default OrderDetailsAdminPage;
