"use client";

import { memo, type PropsWithChildren } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileDialog = memo(
  ({
    isOpen,
    onOpenChange,
    children,
  }: PropsWithChildren<EditProfileDialogProps>) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Edit profile information</DialogTitle>
      <DialogContent className="max-w-lg p-0">{children}</DialogContent>
    </Dialog>
  )
);

EditProfileDialog.displayName = "EditProfileDialog";
