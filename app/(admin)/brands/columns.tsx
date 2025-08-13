"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUp, Loader, PencilLine, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import { formatDate } from "@/lib/utils";
import { deleteBrand } from "@/actions/brand.actions";

export type Brand = {
  id: string;
  name: string;
  createdAt: Date;
};

export const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Brand name
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
      const brand = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/brands/${brand.id}/edit`}
            className={buttonVariants({ size: "icon", variant: "outline" })}
            title="Edit brand"
            aria-label="Edit brand info"
          >
            <PencilLine />
          </Link>
          <DeleteButton brandId={brand.id} />
        </div>
      );
    },
  },
];

const DeleteButton = ({ brandId }: { brandId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(() => {
      deleteBrand(brandId)
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
          toast.error("An error occurred while deleting the brand.");
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
        title="Delete brand"
        aria-label="Delete brand"
        size="icon"
        disabled={isPending}
      >
        {isPending ? <Loader className="animate-spin" /> : <Trash2 />}
      </Button>

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Confirm delete brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
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
