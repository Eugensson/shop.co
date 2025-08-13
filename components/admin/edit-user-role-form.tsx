"use client";

import * as z from "zod";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSelect } from "@/components/form-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ROLE_TYPES } from "@/constants";
import { editUserRoleSchema } from "@/schemas";
import { changeUserRole } from "@/actions/user.actions";
import type { User } from "@/app/(admin)/users/columns";

interface EditUserRoleFormProps {
  onFinished: () => void;
  user?: User;
}

export const EditUserRoleForm: React.FC<EditUserRoleFormProps> = ({
  onFinished,
  user,
}) => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<z.infer<typeof editUserRoleSchema>>({
    resolver: zodResolver(editUserRoleSchema),
    defaultValues: {
      role: user?.role ?? UserRole.USER,
    },
  });

  const onSubmit = (values: z.infer<typeof editUserRoleSchema>) => {
    setError("");

    startTransition(() => {
      if (!user?.id) {
        setError("User not found");
        return;
      }

      changeUserRole({
        userId: user.id,
        newRole: values.role,
      })
        .then(async (data) => {
          if (data?.error) {
            setError(data.error);
            toast.error(data.error);
            return;
          }
          toast.success(data.success ?? "User role updated");
          await update();
          onFinished();
        })
        .catch((error) => {
          console.error("Error changing user role:", error);
          setError("Something went wrong. Please try again.");
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-center space-y-2">
          <p>Edit user role for: {user?.name}</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormSelect
              id="role"
              name="role"
              label="Role"
              placeholder="Select role"
              options={ROLE_TYPES.map(({ name, value }) => ({
                value,
                label: name,
              }))}
              required
              disabled={isPending}
            />
            {error && (
              <div role="alert" aria-live="polite" aria-atomic="true">
                <FormError message={error} />
              </div>
            )}
            <div className="mt-10 flex justify-center gap-5">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 cursor-pointer"
                disabled={isPending}
                aria-label="Cancel changes to user profile"
                onClick={onFinished}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="flex-1 cursor-pointer"
                aria-label="Save changes to user profile"
              >
                {isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
