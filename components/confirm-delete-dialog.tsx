"use client";

import { TriangleAlert } from "lucide-react";
import { memo, useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

export const ConfirmDeleteDialog = memo(function ConfirmDeleteDialog({
  isOpen,
  onOpenChange,
  title = "Confirm deletion",
  description = "This action cannot be undone. Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
}: ConfirmDeleteDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = useCallback(async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
    }
  }, [onConfirm, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-5 text-xl text-destructive flex items-center gap-2">
            <TriangleAlert />
            {title}
          </DialogTitle>
          <DialogDescription className="mb-5">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing || loading}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessing || loading}
          >
            {loading || isProcessing ? "Deleting..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
