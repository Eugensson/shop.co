"use client";

import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { editOrderSchema } from "@/schemas";
import { EditPaymentDateValues } from "@/types";
import { editOrder } from "@/actions/order.actions";

interface FormPaymentPickerProps {
  orderId: string;
  paidAt: Date | undefined;
  disabled?: boolean;
}

export const FormPaymentPicker = ({
  orderId,
  paidAt,
  disabled = false,
}: FormPaymentPickerProps) => {
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [paidDate, setPaidDate] = useState<Date | undefined>(paidAt);

  const form = useForm<EditPaymentDateValues>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      orderId,
      paidAt,
    },
  });

  const { setValue } = form;

  const onPaidDateChange = (date: Date | undefined) => {
    if (date?.toISOString() === paidDate?.toISOString()) return;

    setPaidDate(date);
    setValue("paidAt", date, { shouldValidate: true });
    setOpen(false);

    startTransition(() => {
      editOrder({ orderId, paidAt: date })
        .then(async (res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success("Payment date updated");
          await update();
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  useEffect(() => {
    const date = paidAt ?? undefined;
    setPaidDate(date);
    setValue("paidAt", date);
  }, [paidAt, setValue]);

  return (
    <FormProvider {...form}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isPending || disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !paidDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {paidDate ? (
              format(paidDate, "dd MMMM yyyy")
            ) : (
              <span>Select payment date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={paidDate}
            onSelect={onPaidDateChange}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    </FormProvider>
  );
};
