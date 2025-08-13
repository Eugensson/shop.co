"use client";

import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { useTransition, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, ShieldCheck, RotateCcw, ArrowDownUp, Ban } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { EditUserRoleDialog } from "@/components/admin/edit-user-role-dialog";

import { cn, formatDate } from "@/lib/utils";
import { softDeleteUser, restoreUser } from "@/actions/user.actions";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<User>[] = [
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
    cell: ({ row }) => <span className="ml-3">{row.original.name}</span>,
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
    cell: ({ row }) => <span className="ml-3">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant="outline" className="ml-3 rounded">
          {role === UserRole.ADMIN ? "Admin" : "Customer"}
        </Badge>
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
        Registered at
        <ArrowDownUp />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="ml-3">{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    accessorKey: "isActive",
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
      const isActived = row.original.isActive;
      return (
        <Badge variant="outline" className="ml-3 rounded">
          {isActived ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];

const UserActionsCell = ({ user }: { user: User }) => {
  const [openRoleDlg, setOpenRoleDlg] = useState(false);
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="outline"
        size="icon"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "cursor-pointer"
        )}
        title="Change role"
        aria-label="Change role"
        onClick={() => setOpenRoleDlg(true)}
      >
        <ShieldCheck />
      </Button>

      {user.isActive ? (
        <DeleteButton userId={user.id} userName={user.name} />
      ) : (
        <RestoreButton userId={user.id} />
      )}

      <EditUserRoleDialog
        isOpen={openRoleDlg}
        onOpenChange={setOpenRoleDlg}
        user={user}
      />
    </div>
  );
};

const RestoreButton = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleRestore = () => {
    startTransition(async () => {
      const res = await restoreUser(userId);
      if (res?.error) toast.error(res.error);
      else if (res?.success) toast.success(res.success);
    });
  };

  return (
    <Button
      onClick={handleRestore}
      size="icon"
      disabled={isPending}
      variant="secondary"
      title="Restore user"
      aria-label="Restore user"
      className="cursor-pointer"
    >
      {isPending ? <Loader className="animate-spin" /> : <RotateCcw />}
    </Button>
  );
};

const DeleteButton = ({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [openDlg, setOpenDlg] = useState(false);

  const handleSoftDelete = () => {
    startTransition(async () => {
      const res = await softDeleteUser(userId);
      if (res?.error) toast.error(res.error);
      else if (res?.success) toast.success(res.success);
    });
  };

  return (
    <>
      <Button
        onClick={() => setOpenDlg(true)}
        size="icon"
        variant="outline"
        disabled={isPending}
        title="Deactivate user"
        aria-label="Deactivate user"
        className="cursor-pointer"
      >
        {isPending ? <Loader className="animate-spin" /> : <Ban />}
      </Button>

      <ConfirmDeleteDialog
        isOpen={openDlg}
        onOpenChange={setOpenDlg}
        title="Confirm deactivation"
        description={`Are you sure you want to deactivate ${userName}? User will not be able to login, but all their orders will remain in the database.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        loading={isPending}
        onConfirm={async () => {
          await handleSoftDelete();
          setOpenDlg(false);
        }}
      />
    </>
  );
};
