"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUp, Loader, PencilLine, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import { formatDate } from "@/lib/utils";
import { deleteColor } from "@/actions/color.actions";

export type Color = {
  id: string;
  name: string;
  hex: string;
  createdAt: Date;
};

export const columns: ColumnDef<Color>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Color name
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
    accessorKey: "hex",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          HEX code
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { hex } = row.original;

      return <span className="ml-3">{hex}</span>;
    },
  },
  {
    accessorKey: "view",
    header: "View",
    cell: ({ row }) => {
      const { hex } = row.original;
      const bgColor = hex.startsWith("#") ? hex : `#${hex}`;

      return (
        <div
          className="ml-3 w-8 h-8 rounded-full border-2 border-gray-300"
          style={{ backgroundColor: bgColor }}
          aria-label={`Color preview ${bgColor}`}
          role="img"
        />
      );
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
      const color = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/colors/${color.id}/edit`}
            className={buttonVariants({ size: "icon", variant: "outline" })}
            title="Edit color"
            aria-label="Edit color info"
          >
            <PencilLine />
          </Link>
          <DeleteButton colorId={color.id} />
        </div>
      );
    },
  },
];

const DeleteButton = ({ colorId }: { colorId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(() => {
      deleteColor(colorId)
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
          toast.error("An error occurred while deleting the color.");
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
        title="Delete color"
        aria-label="Delete color"
        size="icon"
        disabled={isPending}
      >
        {isPending ? <Loader className="animate-spin" /> : <Trash2 />}
      </Button>

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Confirm delete color"
        description="Are you sure you want to delete this color? This action cannot be undone."
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
