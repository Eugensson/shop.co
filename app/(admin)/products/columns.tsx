"use client";

import {
  Archive,
  ArrowDownUp,
  Eye,
  Loader,
  PencilLine,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ProductImage } from "@prisma/client";
import { useState, useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import { formatDate } from "@/lib/utils";
import { toggleArchiveProduct } from "@/actions/product.actions";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: { name: string };
  images: ProductImage[];
  brand: { name: string };
  isNewArrival: boolean;
  isArchived: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "imageUrl",
    accessorKey: "imageUrl",
    header: "",
    cell: ({ row }) => {
      const { images } = row.original;

      const mainImage = images.find((img) => img.isMain) ?? images[0];

      return (
        <div className="flex items-center gap-2">
          <Image
            width={75}
            height={75}
            src={mainImage?.url ?? "/placeholder.jpg"}
            sizes="100vw"
            alt="Product image"
            className="aspect-square object-cover object-center"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
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
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { sku } = row.original;

      return <span className="ml-3 capitalize">{sku}</span>;
    },
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category name
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { category } = row.original;

      return <span className="ml-3 capitalize">{category.name}</span>;
    },
  },
  {
    accessorKey: "brand.name",
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
      const { brand } = row.original;

      return <span className="ml-3 capitalize">{brand.name}</span>;
    },
  },
  {
    accessorKey: "isNewArrival",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          New arrival
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { isNewArrival } = row.original;

      return <span className="ml-3">{isNewArrival ? "Yes" : "No"}</span>;
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
      const product = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/products/${product.id}`}
            className={buttonVariants({ size: "icon", variant: "outline" })}
            title="Details"
            aria-label="Details about product"
          >
            <Eye />
          </Link>
          <Link
            href={`/products/${product.id}/edit`}
            className={buttonVariants({ size: "icon", variant: "outline" })}
            title="Edit"
            aria-label="Edit product info"
          >
            <PencilLine />
          </Link>
          <ToggleArchiveButton
            productId={product.id}
            isArchived={product.isArchived}
          />
        </div>
      );
    },
  },
];

const ToggleArchiveButton = ({
  productId,
  isArchived,
}: {
  productId: string;
  isArchived: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleArchive = () => {
    startTransition(() => {
      toggleArchiveProduct(productId)
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
          toast.error("An error occurred while archiving the product.");
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
        title={isArchived ? "Restore" : "Archive"}
        aria-label={isArchived ? "Restore product" : "Archive product"}
        size="icon"
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="animate-spin" />
        ) : isArchived ? (
          <RotateCcw />
        ) : (
          <Archive />
        )}
      </Button>

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={
          isArchived ? "Confirm restore product" : "Confirm archive product"
        }
        description={
          isArchived
            ? "Are you sure you want to restore this product?"
            : "Are you sure you want to archive this product? This action can be undone."
        }
        onConfirm={async () => {
          await handleArchive();
          setIsDialogOpen(false);
        }}
        loading={isPending}
        confirmText={isArchived ? "Restore" : "Archive"}
        cancelText="Cancel"
      />
    </>
  );
};
