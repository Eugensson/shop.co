"use client";

import { DateRange } from "react-day-picker";
import { useState, useTransition, useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/admin/kpi-card";
import { OrdersChart } from "@/components/admin/orders-chart";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { TopUsersTable } from "@/components/admin/top-users-table";
import { TopProductsTable } from "@/components/admin/top-products-table";
import { RecentSalesTable } from "@/components/admin/recent-sales-table";
import { CalendarDateRangePicker } from "@/components/admin/date-range-picker";
import { BestSellingCategories } from "@/components/admin/best-selling-categories";
import { ProductPerformanceTable } from "@/components/admin/product-performance-table";

import {
  getOrderSummary,
  type OrderSummary,
} from "@/actions/orderSummary.actions";
import { calculatePastDate } from "@/lib/format-date-time";

export const Report = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: calculatePastDate(30),
    to: new Date(),
  });

  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!date?.from || !date?.to) return;

    startTransition(() =>
      getOrderSummary({
        from: date.from!,
        to: date.to!,
      }).then(setSummary)
    );
  }, [date?.from, date?.to]);

  const handleDateChange: React.Dispatch<
    React.SetStateAction<DateRange | undefined>
  > = (incoming) => {
    const nextRange =
      typeof incoming === "function" ? incoming(date) : incoming;

    setDate(nextRange);

    if (nextRange?.from && nextRange?.to) {
      startTransition(() =>
        getOrderSummary({
          from: nextRange.from!,
          to: nextRange.to!,
        }).then(setSummary)
      );
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl leading-relaxed font-medium">
          Overview report
        </h2>
        <CalendarDateRangePicker
          defaultDate={date}
          setDate={handleDateChange}
        />
      </div>

      {isPending && <Skeleton className="h-100 w-full rounded-2xl" />}

      {summary && !isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RevenueChart data={summary.revenueByDay} />
          <TopProductsTable products={summary.topProducts} />
          <TopUsersTable users={summary.topUsers} />
          <BestSellingCategories data={summary.topCategories} />
          <RecentSalesTable sales={summary.recentSales} />
          <ProductPerformanceTable products={summary.topProducts} />
          <OrdersChart data={summary.ordersByDay} />
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard title="Products sold" value={summary.totalProductsSold} />
            <KpiCard title="Paid orders" value={summary.paidOrders} />
            <KpiCard title="Delivered orders" value={summary.deliveredOrders} />
            <KpiCard title="New users" value={summary.newUsers} />
          </div>
        </div>
      )}
    </section>
  );
};
