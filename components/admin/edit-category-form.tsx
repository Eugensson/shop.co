"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type Category } from "@prisma/client";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { FormError } from "@/components/form-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { editCategorySchema } from "@/schemas";
import { editCategory } from "@/actions/category.actions";

interface EditBrandFormProps {
  category: Category;
}

export const EditCategoryForm = ({ category }: EditBrandFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof editCategorySchema>>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category.name,
    },
  });

  const onSubmit = (values: z.infer<typeof editCategorySchema>) => {
    setError("");

    startTransition(() => {
      editCategory(category.id, values).then((data) => {
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
          Edit category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormInput
              id="name"
              name="name"
              label="Category name"
              placeholder="For example: Hoodies"
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
                aria-label="Edit category"
                disabled={isPending}
              >
                {isPending ? "Editing..." : "Edit category"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
