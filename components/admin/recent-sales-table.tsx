"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface Sale {
  orderId: string;
  buyer: string;
  date: string;
  total: number;
}

interface RecentSalesTableProps {
  sales: Sale[];
}

export const RecentSalesTable = ({ sales }: RecentSalesTableProps) => {
  return (
    <Card className="h-full max-h-100">
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-75 pr-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Date of purchase</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.orderId}>
                  <TableCell>{sale.buyer}</TableCell>
                  <TableCell>
                    {new Date(sale.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    $&nbsp;
                    {sale.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/orders/${sale.orderId}`}
                      className={cn(
                        buttonVariants({
                          variant: "link",
                          size: "xs",
                        }),
                        "px-0"
                      )}
                    >
                      View details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
