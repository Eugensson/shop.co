"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DeliveryMethod, PaymentMethod } from "@prisma/client";
import { ArrowDownUp, Eye, Loader, PencilLine, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import { deleteOrder } from "@/actions/order.actions";
import { cn, formatCurrency, formatDate, formatId } from "@/lib/utils";

export type Order = {
  id: string;
  user: {
    name: string;
  };
  totalPrice: number;
  isPaid: boolean;
  isRead: boolean;
  isDelivered: boolean;
  paidAt: Date | null;
  deliveredAt: Date | null;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Order №
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { id, isRead } = row.original;
      return (
        <span
          className={cn(
            "ml-3",
            isRead ? "text-muted-foreground" : "font-semibold"
          )}
        >
          {formatId(id)}
        </span>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const {
        user: { name },
        isRead,
      } = row.original;
      return (
        <span
          className={cn(
            "ml-3",
            isRead ? "text-muted-foreground" : "font-semibold"
          )}
        >
          {name}
        </span>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total price
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { totalPrice, isRead } = row.original;
      return (
        <span
          className={cn(
            "ml-3",
            isRead ? "text-muted-foreground" : "font-semibold"
          )}
        >
          {formatCurrency(totalPrice)}
        </span>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Paid
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { isPaid } = row.original;
      return (
        <Badge className="ml-3 rounded" variant="outline">
          {isPaid ? "Paid" : "Unpaid"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Paid at
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { paidAt, isRead } = row.original;
      return (
        <span
          className={cn(
            "ml-3",
            isRead ? "text-muted-foreground" : "font-semibold"
          )}
        >
          {paidAt ? formatDate(paidAt) : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "isDelivered",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Delivered
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { isDelivered } = row.original;
      return (
        <Badge className="ml-3 rounded" variant="outline">
          {isDelivered ? "Delivered" : "Not delivered"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deliveredAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Delivered at
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { deliveredAt, isRead } = row.original;
      return (
        <span
          className={cn(
            "ml-3",
            isRead ? "text-muted-foreground" : "font-semibold"
          )}
        >
          {deliveredAt ? formatDate(deliveredAt) : "-"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/orders/${order.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
            title="Preview"
            aria-label="Preview order details"
          >
            <Eye />
          </Link>
          <Link
            href={`/orders/${order.id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
            title="Edit"
            aria-label="Edit order"
          >
            <PencilLine />
          </Link>
          <DeleteButton orderId={order.id} />
        </div>
      );
    },
  },
];

type DeleteButtonProps = {
  orderId: string;
};

export const DeleteButton = ({ orderId }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    startTransition(() => {
      deleteOrder(orderId)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          } else if (data?.success) {
            toast.success(data.success);
          } else {
            toast.error("An unknown error has occurred!");
          }
        })
        .catch(() => {
          toast.error("An error occurred while deleting the order.");
        });
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        type="button"
        variant="outline"
        className="cursor-pointer"
        title="Delete"
        aria-label="Delete order"
        size="icon"
        disabled={isPending}
      >
        {isPending ? <Loader className="animate-spin" /> : <Trash2 />}
      </Button>

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Confirm order deletion"
        description="Are you sure you want to delete this order? This action cannot be undone."
        onConfirm={async () => {
          await handleDelete();
          setIsDialogOpen(false);
        }}
        loading={isPending}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};
