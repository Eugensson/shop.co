"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, FormProvider } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";
import { editOrderSchema } from "@/schemas";
import { EditPaymentStatusValues } from "@/types";
import { editOrder } from "@/actions/order.actions";

interface FormPaymentStatusToggleProps {
  orderId: string;
  paymentStatus: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormPaymentStatusToggle = ({
  orderId,
  paymentStatus,
  disabled = false,
  className,
}: FormPaymentStatusToggleProps) => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditPaymentStatusValues>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      orderId,
      isPaid: !!paymentStatus,
    },
  });

  const { control } = form;

  const onSubmit = (values: EditPaymentStatusValues) => {
    startTransition(() => {
      editOrder({ ...values, orderId })
        .then(async (res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success("Payment status updated");
          await update();
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <Controller
          name="isPaid"
          control={control}
          render={({ field }) => (
            <FormItem
              className={cn(
                "flex flex-row justify-between items-center rounded-md border p-3 shadow-sm",
                className
              )}
            >
              <div className="space-y-0.5">
                <FormLabel htmlFor="isPaid">Payment status</FormLabel>
              </div>
              <FormControl>
                <Switch
                  id="isPaid"
                  disabled={isPending || disabled}
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    form.handleSubmit(onSubmit)();
                  }}
                  aria-describedby="paymentStatusDescription"
                  className="cursor-pointer"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
};
