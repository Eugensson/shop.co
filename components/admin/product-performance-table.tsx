"use client";

import Image from "next/image";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { formatCurrency } from "@/lib/utils";

type Product = {
  productId: string;
  name: string;
  imageUrl: string | null;
  totalRevenue: number;
};

interface Props {
  products: Product[];
}

export const ProductPerformanceTable = ({ products }: Props) => {
  if (!products.length) return null;

  const maxRevenue = Math.max(...products.map((p) => p.totalRevenue));

  return (
    <Card className="col-span-1 md:col-span-2 h-full max-h-100">
      <CardHeader>
        <CardTitle>Product performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-75 pr-2">
          <Table>
            <TableHeader className="[&_tr]:border-none">
              <TableRow>
                <TableHead className="w-25 h-0.25" />
                <TableHead className="h-0.25" />
                <TableHead className="w-75 h-0.25" />
                <TableHead className="w-40 h-0.25 text-end" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((p) => {
                const percent = (p.totalRevenue / maxRevenue) * 100;
                return (
                  <TableRow key={p.productId}>
                    <TableCell>
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      )}
                    </TableCell>

                    <TableCell className="text-start">
                      <p className="font-medium leading-tight">{p.name}</p>
                    </TableCell>

                    <TableCell>
                      <Progress
                        value={percent}
                        className="mt-1 h-2 rotate-180"
                      />
                    </TableCell>

                    <TableCell className="text-end">
                      {formatCurrency(p.totalRevenue)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
