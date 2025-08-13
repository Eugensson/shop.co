"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUp, Loader, Trash2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import {
  deleteReview,
  editVerifiedPurchaseInReview,
} from "@/actions/review.actions";
import { formatDate } from "@/lib/utils";

export type Review = {
  id: string;
  comment: string;
  rating: number;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  user: {
    name: string;
  };
  product: {
    name: string;
    slug: string;
  };
};

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "comment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Review
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { comment } = row.original;
      return <span className="ml-3">{comment}</span>;
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { rating } = row.original;
      return <span className="ml-3">{rating}</span>;
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
          Published at
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
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { user } = row.original;
      return <span className="ml-3">{user.name}</span>;
    },
  },
  {
    accessorKey: "product.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product name
          <ArrowDownUp />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { product } = row.original;
      return (
        <Link href={`/product/${product.slug}`} className="ml-3 capitalize">
          {product.name}
        </Link>
      );
    },
  },
  {
    id: "isVerifiedPurchase",
    header: "Verified purchase",
    cell: ({ row }) => {
      const { id, isVerifiedPurchase } = row.original;

      return (
        <div className="flex items-center justify-center gap-2">
          <ToggleVerifiedPurchase
            reviewId={id}
            isVerifiedPurchase={isVerifiedPurchase}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <div className="flex items-center justify-center gap-2">
          <DeleteButton reviewId={id} />
        </div>
      );
    },
  },
];

interface ToggleVerifiedPurchaseProps {
  reviewId: string;
  isVerifiedPurchase: boolean;
}

const ToggleVerifiedPurchase = ({
  reviewId,
  isVerifiedPurchase,
}: ToggleVerifiedPurchaseProps) => {
  const [isPending, startTransition] = useTransition();

  const onCheckedChange = async (reviewId: string) => {
    startTransition(() => {
      editVerifiedPurchaseInReview(reviewId)
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
          toast.error("An error occurred while editing the review.");
        });
    });
  };

  return (
    <Switch
      id={`verifiedPurchase-${reviewId}`}
      checked={isVerifiedPurchase}
      onCheckedChange={onCheckedChange.bind(null, reviewId)}
      className="cursor-pointer"
      disabled={isPending}
    />
  );
};

type DeleteButtonProps = {
  reviewId: string;
};

export const DeleteButton = ({ reviewId }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    startTransition(() => {
      deleteReview(reviewId)
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
          toast.error("An error occurred while deleting the review.");
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
        aria-label="Delete review"
        size="icon"
        disabled={isPending}
      >
        {isPending ? <Loader className="animate-spin" /> : <Trash2 />}
      </Button>

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Confirm review deletion"
        description="Are you sure you want to delete this review? This action cannot be undone."
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
