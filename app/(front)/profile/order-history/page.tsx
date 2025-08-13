import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Nav } from "@/components/nav";

import { currentUser } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { formatCurrency } from "@/lib/utils";
import { DELIVERY_METHOD_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/constants";

const OrderHistoryPage = async () => {
  const user = await currentUser();

  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      deliveryAddress: true,
    },
  });

  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-12 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <Nav
        segments={[
          { label: "Profile", href: "/profile" },
          { label: "Order History", href: "" },
        ]}
      />
      <div className="space-y-10 lg:space-y-20">
        <h2 className="text-3xl lg:text-5xl text-center uppercase font-black tracking-tight font-secondary">
          Order History
        </h2>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Delivery Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{`...${order.id.slice(
                  0,
                  6
                )}`}</TableCell>
                <TableCell>{order.isPaid ? "Paid" : "Unpaid"}</TableCell>
                <TableCell>
                  {order.isDelivered ? "Delivered" : "Pending"}
                </TableCell>
                <TableCell>
                  {PAYMENT_METHOD_OPTIONS[order.paymentMethod]}
                </TableCell>
                <TableCell>
                  {DELIVERY_METHOD_OPTIONS[order.deliveryMethod]}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(order.totalPrice)}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/profile/order-history/${order.id}`}
                    className="text-blue-700 underline-offset-4 hover:underline"
                  >
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default OrderHistoryPage;
