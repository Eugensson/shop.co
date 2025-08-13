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
import { editOrder } from "@/actions/order.actions";
import { EditDeliveryDateValues } from "@/types";

interface FormDeliveryPickerProps {
  orderId: string;
  deliveredAt: Date | undefined;
  disabled?: boolean;
}

export const FormDeliveryPicker = ({
  orderId,
  deliveredAt,
  disabled = false,
}: FormDeliveryPickerProps) => {
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deliveredDate, setDeliveredDate] = useState<Date | undefined>(
    deliveredAt
  );

  const form = useForm<EditDeliveryDateValues>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      orderId,
      deliveredAt,
    },
  });

  const { setValue } = form;

  const onDeliveredDateChange = (date: Date | undefined) => {
    if (date?.toISOString() === deliveredDate?.toISOString()) return;

    setDeliveredDate(date);
    setValue("deliveredAt", date, { shouldValidate: true });
    setOpen(false);

    startTransition(() => {
      editOrder({ orderId, deliveredAt: date })
        .then(async (res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success("Delivery date updated");
          await update();
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  useEffect(() => {
    const date = deliveredAt ?? undefined;
    setDeliveredDate(date);
    setValue("deliveredAt", date);
  }, [deliveredAt, setValue]);

  return (
    <FormProvider {...form}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isPending || disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !deliveredDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {deliveredDate ? (
              format(deliveredDate, "dd MMMM yyyy")
            ) : (
              <span>Select delivery date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={deliveredDate}
            onSelect={onDeliveredDateChange}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    </FormProvider>
  );
};
