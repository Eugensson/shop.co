import Link from "next/link";
import type { Metadata } from "next";
import { Users, Inbox, CalendarDays, Calculator } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Report } from "@/components/admin/report";
import { buttonVariants } from "@/components/ui/button";

import { OverviewCard } from "@/types";
import { prisma } from "@/prisma/prisma";
import { cn, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: true,
  },
};

const AdminDashboardPage = async () => {
  const [
    ordersCount,
    productsCount,
    activeProductsCount,
    usersCount,
    paidOrdersSum,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        isPaid: true,
      },
    }),
  ]);

  const OVERVIEW_CARD_ITEMS: OverviewCard[] = [
    {
      id: "sales",
      title: "Actual sales",
      icon: <Calculator />,
      value: formatCurrency(Number(paidOrdersSum._sum.totalPrice)),
      href: "/orders",
    },
    {
      id: "products-active",
      title: "Active products",
      icon: <Inbox />,
      value: activeProductsCount,
      href: "/products",
      description: `Total products: ${productsCount}`,
    },
    {
      id: "users",
      title: "Users",
      icon: <Users />,
      value: usersCount,
      href: "/users",
    },
    {
      id: "orders",
      title: "Orders",
      icon: <CalendarDays />,
      value: ordersCount,
      href: "/orders",
    },
  ];

  return (
    <section className="flex-1 p-5 lg:p-10 flex flex-col gap-5">
      <h2 className="text-2xl leading-relaxed font-medium">
        Dashboard overview
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {OVERVIEW_CARD_ITEMS.map(
          ({ id, title, icon, value, href, description }) => (
            <li key={id}>
              <Card className="h-full py-2 flex flex-col justify-between gap-4">
                <CardHeader className="px-3 flex items-center justify-between text-muted-foreground">
                  <CardTitle>{title}</CardTitle>
                  {icon}
                </CardHeader>

                <CardContent className="text-center">
                  <h2 className="text-2xl leading-relaxed font-medium">
                    {value}
                  </h2>
                </CardContent>

                <CardFooter
                  className={cn(
                    "pl-2 pr-1",
                    description ? "justify-between" : "justify-end"
                  )}
                >
                  {description && (
                    <CardDescription className="text-xs">
                      {description}
                    </CardDescription>
                  )}
                  <Link
                    href={href}
                    className={buttonVariants({ variant: "link", size: "xs" })}
                  >
                    View
                  </Link>
                </CardFooter>
              </Card>
            </li>
          )
        )}
      </ul>
      <Report />
    </section>
  );
};

export default AdminDashboardPage;
