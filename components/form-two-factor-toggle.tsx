"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Controller, useForm, FormProvider } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import { EditProfileValues } from "@/types";
import { editProfileSchema } from "@/schemas";
import { settings } from "@/actions/user.actions";

interface FormTwoFactorToggleProps {
  disabled?: boolean;
}

export const FormTwoFactorToggle = ({
  disabled = false,
}: FormTwoFactorToggleProps) => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      isTwoFactorEnabled: !!user?.isTwoFactorEnabled,
    },
  });

  const { control } = form;

  const onSubmit = (values: EditProfileValues) => {
    startTransition(() => {
      settings(values)
        .then(async (res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success(res.success ?? "Profile updated");
          await update();
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="isTwoFactorEnabled"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel htmlFor="isTwoFactorEnabled">
                  Two factor authentication
                </FormLabel>
                <FormDescription>
                  Enable two-factor authentication to protect your account.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="isTwoFactorEnabled"
                  disabled={isPending || disabled}
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    form.handleSubmit(onSubmit)();
                  }}
                  aria-describedby="twoFactorDescription"
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
