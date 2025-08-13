"use client";

import Image from "next/image";
import { ClipboardList, Info } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductPrice } from "@/components/product-price";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { OrderWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { DELIVERY_METHOD_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/constants";
import { FormPaymentStatusToggle } from "./form-payment-status-toggle";
import { FormDeliveryStatusToggle } from "./form-delivery-status-toggle";
import { FormPaymentPicker } from "./form-payment-picker";
import { FormDeliveryPicker } from "./form-delivery-picker";

interface EditOrderFormProps {
  order: OrderWithRelations;
}

export const EditOrderForm = ({ order }: EditOrderFormProps) => {
  const totalItems = order?.items.reduce((a, c) => a + c.quantity, 0);

  return (
    <div className="p-5 w-full grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList size={20} />
            Order items overview
          </CardTitle>
          <Separator className="mt-2" />
        </CardHeader>
        <ScrollArea className="h-85 p-2 pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-60 sr-only">Image</TableHead>
                <TableHead>Product name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Item price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.items.map((item) => (
                <TableRow key={item.productSlug}>
                  <TableCell className="w-30">
                    <Image
                      src={item.imageUrl ?? "/placeholder.png"}
                      alt={item.productName}
                      width={120}
                      height={120}
                      className="object-contain aspect-square"
                    />
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
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <ProductPrice
                      price={item.price}
                      discountedPrice={item.discountedPrice}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  Total price&nbsp;({totalItems}&nbsp;
                  {totalItems === 1 ? "product" : "products"}
                  ):
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(order.totalPrice)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ScrollArea>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            <CardTitle>Customer Info, Payment and Shipping Details</CardTitle>
          </CardTitle>
          <Separator className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm flex items-center justify-between">
            <h3>Name</h3>
            <p>
              {order?.deliveryAddress?.firstName}&nbsp;
              {order?.deliveryAddress?.lastName}
            </p>
          </div>
          <div className="text-sm flex items-center justify-between">
            <h3>Contact phone number</h3>
            <p>{order?.deliveryAddress?.phone}</p>
          </div>
          <div className="text-sm flex items-center justify-between">
            <h3>Contact email address</h3>
            <p>{order?.deliveryAddress?.email}</p>
          </div>
          <div className="text-sm flex items-center justify-between">
            <h3>Payment method</h3>
            <p>{PAYMENT_METHOD_OPTIONS[order.paymentMethod]}</p>
          </div>
          <div className="text-sm flex items-center justify-between">
            <h3>Delivery method</h3>
            <p>{DELIVERY_METHOD_OPTIONS[order.deliveryMethod]}</p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FormPaymentStatusToggle
              orderId={order.id}
              paymentStatus={order.isPaid}
              className="h-full"
            />
            <FormPaymentPicker
              orderId={order.id}
              paidAt={order.paidAt ?? undefined}
            />
            <FormDeliveryStatusToggle
              orderId={order.id}
              deliveryStatus={order.isDelivered}
              className="h-full"
            />
            <FormDeliveryPicker
              orderId={order.id}
              deliveredAt={order.deliveredAt ?? undefined}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
