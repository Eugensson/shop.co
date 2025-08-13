"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HexColorPicker } from "react-colorful";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { FormError } from "@/components/form-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createColorSchema } from "@/schemas";
import { createColor } from "@/actions/color.actions";

export const CreateColorForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof createColorSchema>>({
    resolver: zodResolver(createColorSchema),
    defaultValues: { name: "", hex: "000000" },
  });

  const hexValue = useWatch({ control: form.control, name: "hex" });

  const onSubmit = (values: z.infer<typeof createColorSchema>) => {
    setError("");

    startTransition(() => {
      createColor(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          toast.success(data.success);
          router.push("/colors");
        }
      });
    });
  };

  const handleColorChange = (color: string) => {
    const cleanColor = color.replace(/^#/, "");
    form.setValue("hex", cleanColor, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-xl py-10 px-5 h-fit">
      <CardHeader>
        <CardTitle className="text-center uppercase font-bold text-lg">
          Add a new color
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormInput
              id="name"
              name="name"
              label="Color name"
              placeholder="For example: Black"
              disabled={isPending}
              required
            />
            <FormInput
              id="hex"
              name="hex"
              label="HEX code"
              placeholder="For example: 000000"
              disabled={isPending}
              required
            />
            <div className="mx-auto w-48">
              <HexColorPicker
                color={"#" + hexValue}
                onChange={handleColorChange}
                style={{ borderRadius: 8 }}
              />
            </div>
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
                {isPending ? "Adding..." : "Add color"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
