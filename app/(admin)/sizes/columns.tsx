"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUp, Loader, PencilLine, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import { formatDate } from "@/lib/utils";
import { deleteSize } from "@/actions/size.actions";

export type Size = {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
};

export const columns: ColumnDef<Size>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size name
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { name } = row.original;

      return <span className="ml-3 capitalize">{name}</span>;
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size value
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { value } = row.original;

      return <span className="ml-3 capitalize">{value}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date created
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { createdAt } = row.original;

      return <span className="ml-3">{formatDate(createdAt)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const size = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/sizes/${size.id}/edit`}
            className={buttonVariants({ size: "icon", variant: "outline" })}
            title="Edit size"
            aria-label="Edit size info"
          >
            <PencilLine />
          </Link>
          <DeleteButton sizeId={size.id} />
        </div>
      );
    },
  },
];

const DeleteButton = ({ sizeId }: { sizeId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(() => {
      deleteSize(sizeId)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          } else if (data?.success) {
            toast.success(data.success);
          } else {
            toast.error("An unknown error occurred. Please try again.");
          }
        })
        .catch(() => {
          toast.error("An error occurred while deleting the size.");
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
        title="Delete size"
        aria-label="Delete size"
        size="icon"
        disabled={isPending}
      >
        {isPending ? <Loader className="animate-spin" /> : <Trash2 />}
      </Button>

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Confirm delete size"
        description="Are you sure you want to delete this size? This action cannot be undone."
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
