"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { FormError } from "@/components/form-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createCategorySchema } from "@/schemas";
import { createCategory } from "@/actions/category.actions";

export const CreateCategoryForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (values: z.infer<typeof createCategorySchema>) => {
    setError("");

    startTransition(() => {
      createCategory(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          toast.success(data.success);
          router.push("/categories");
        }
      });
    });
  };

  return (
    <Card className="w-full max-w-xl py-10 px-5 h-fit">
      <CardHeader>
        <CardTitle className="text-center uppercase font-bold text-lg">
          Add a new category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormInput
              id="name"
              name="name"
              label="Category name"
              placeholder="For example: Fruit of the loom"
              disabled={isPending}
              required
            />
            {error && (
              <div role="alert" aria-live="polite" aria-atomic="true">
                <FormError message={error} />
              </div>
            )}
            <div className="flex gap-5 mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Adding..." : "Add category"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
