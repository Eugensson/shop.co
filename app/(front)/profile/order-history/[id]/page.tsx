import Image from "next/image";
import { ClipboardList, Info } from "lucide-react";

import { Nav } from "@/components/nav";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { prisma } from "@/prisma/prisma";
import { cn, formatCurrency } from "@/lib/utils";
import { DELIVERY_METHOD_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/constants";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

const OrderDetailsPage = async ({ params }: OrderDetailsPageProps) => {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      deliveryAddress: true,
    },
  });

  if (!order) {
    return (
      <section className="container mx-auto max-w-3xl p-5 text-center text-destructive">
        <p>Order not found.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-7xl pt-5 lg:pt-6 pb-10 px-4 xl:px-0 space-y-6 font-secondary">
      <Nav
        segments={[
          { label: "Profile", href: "/profile" },
          { label: "Order History", href: "/profile/order-history" },
          { label: `Order # ${order.id.slice(0, 8)}`, href: "" },
        ]}
      />
      <h2 className="text-3xl lg:text-5xl text-center uppercase font-black tracking-tight">
        Order Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6">
        <Card className="px-3 py-5 h-fit">
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl flex items-center gap-2 capitalize">
              <ClipboardList size={22} />
              Review Items
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
                        {item.discountedPrice < item.price ? (
                          <div>
                            <span className="line-through text-muted-foreground text-sm mr-1">
                              {formatCurrency(item.price)}
                            </span>
                            {formatCurrency(item.discountedPrice)}
                          </div>
                        ) : (
                          formatCurrency(item.price)
                        )}
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
            <CardTitle className="text-lg lg:text-xl flex items-center gap-2 capitalize">
              <Info size={22} />
              Order Summary
            </CardTitle>
          </CardHeader>
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
            </div>
            <Separator />
            <div className="text-sm space-y-3">
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
      </div>
    </section>
  );
};

export default OrderDetailsPage;
