"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubmitOrderButtonProps {
  onSubmit: () => void;
  isPending?: boolean;
}

export const SubmitOrderButton: React.FC<SubmitOrderButtonProps> = ({
  onSubmit,
  isPending = false,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Button
        type="submit"
        className="w-full rounded-full cursor-pointer"
        disabled={isPending}
      >
        Place Your Order
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};
