import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

import { formatCurrency } from "@/lib/utils";
import { OrderSummary } from "@/actions/orderSummary.actions";

export const TopProductsTable = ({
  products,
}: {
  products: OrderSummary["topProducts"];
}) => {
  return (
    <Card className="h-full max-h-100">
      <CardHeader>
        <CardTitle>Top products</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-75 pr-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Quantity sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-center">
                    {product.quantitySold}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(product.totalRevenue)}
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
