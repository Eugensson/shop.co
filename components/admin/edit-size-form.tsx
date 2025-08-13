"use client";

import * as z from "zod";
import { toast } from "sonner";
import { type Size } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { FormError } from "@/components/form-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { editSizeSchema } from "@/schemas";
import { editSize } from "@/actions/size.actions";

interface EditSizeFormProps {
  size: Size;
}

export const EditSizeForm = ({ size }: EditSizeFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof editSizeSchema>>({
    resolver: zodResolver(editSizeSchema),
    defaultValues: {
      name: size.name,
      value: size.value,
    },
  });

  const onSubmit = (values: z.infer<typeof editSizeSchema>) => {
    setError("");

    startTransition(() => {
      editSize(size.id, values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          toast.success(data.success);
          router.push("/sizes");
        }
      });
    });
  };

  return (
    <Card className="w-full max-w-xl py-10 px-5 h-fit">
      <CardHeader>
        <CardTitle className="text-center uppercase font-bold text-lg">
          Edit size
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormInput
              id="name"
              name="name"
              label="Size name"
              placeholder="For example: Small"
              disabled={isPending}
              required
            />
            <FormInput
              id="value"
              name="value"
              label="Size value"
              placeholder="For example: S"
              disabled={isPending}
              required
            />
            {error && (
              <div role="alert" aria-live="polite" aria-atomic="true">
                <FormError message={error} />
              </div>
            )}
            <div className="mt-10 flex items-center gap-5">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 cursor-pointer"
                disabled={isPending}
                aria-label="Cancel"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 cursor-pointer"
                aria-label="Edit size"
                disabled={isPending}
              >
                {isPending ? "Editing..." : "Edit size"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
