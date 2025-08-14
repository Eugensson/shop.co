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

export const TopUsersTable = ({
  users,
}: {
  users: OrderSummary["topUsers"];
}) => {
  return (
    <Card className="h-full max-h-100">
      <CardHeader>
        <CardTitle>Top users</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-75 pr-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-right">Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">
                    {user.totalOrders}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(user.totalSpent)}
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
