"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUp, Eye, Loader, Mail, MailOpen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  deleteNotification,
  editNotification,
} from "@/actions/notification.actions";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

export type Notification = {
  id: string;
  name: string;
  subject: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "isRead",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { isRead } = row.original;
      return (
        <span
          className="flex items-center ml-3"
          title={isRead ? "Прочитане" : "Нове"}
          aria-label={isRead ? "Прочитане повідомлення" : "Нове повідомлення"}
        >
          {isRead ? (
            <MailOpen size={20} className="text-muted-foreground" />
          ) : (
            <Mail size={20} />
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { name, isRead } = row.original;
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
    accessorKey: "subject",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Subject
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { subject, isRead } = row.original;
      return (
        <span
          className={cn(
            "ml-3",
            isRead ? "text-muted-foreground" : "font-semibold"
          )}
        >
          {subject}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { email, isRead } = row.original;
      return (
        <span
          className={cn(
            "ml-3",
            isRead ? "text-muted-foreground" : "font-semibold"
          )}
        >
          {email}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Received
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const { createdAt, isRead } = row.original;
      return (
        <span
          className={cn(
            "ml-3",
            isRead ? "text-muted-foreground" : "font-semibold"
          )}
        >
          {formatDate(createdAt)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const notification = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <ViewButton
            notificationId={notification.id}
            isRead={notification.isRead}
          />
          <DeleteButton
            notificationId={notification.id}
            isRead={notification.isRead}
          />
        </div>
      );
    },
  },
];

const ViewButton = ({
  notificationId,
  isRead,
}: {
  notificationId: string;
  isRead: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="icon"
      title="View"
      aria-label="View notification"
      disabled={isPending}
      className="cursor-pointer"
      onClick={() => {
        startTransition(async () => {
          await editNotification({ notificationId });
          router.push(`/notifications/${notificationId}/read`);
        });
      }}
    >
      {isPending ? (
        <Loader className="animate-spin" />
      ) : (
        <Eye className={cn(isRead && "text-muted-foreground")} />
      )}
    </Button>
  );
};

const DeleteButton = ({
  notificationId,
  isRead,
}: {
  notificationId: string;
  isRead: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    startTransition(() => {
      deleteNotification(notificationId)
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
          toast.error("An error occurred while deleting the notification.");
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
        aria-label="Delete notification"
        size="icon"
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="animate-spin" />
        ) : (
          <Trash2 className={cn(isRead && "text-muted-foreground")} />
        )}
      </Button>

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Confirm delete notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
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
