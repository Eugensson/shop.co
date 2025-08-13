"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { EditUserRoleForm } from "@/components/admin/edit-user-role-form";

import type { User } from "@/app/(admin)/users/columns";

interface EditUserRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export const EditUserRoleDialog = ({
  isOpen,
  onOpenChange,
  user,
}: EditUserRoleDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Edit user role</DialogTitle>
        </DialogHeader>
        <EditUserRoleForm user={user} onFinished={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
