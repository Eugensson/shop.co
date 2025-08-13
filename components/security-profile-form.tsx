"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signOut, useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FilePenLine, ShieldCheck, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { FormTwoFactorToggle } from "@/components/form-two-factor-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { ExtendedUser } from "@/next-auth";
import { EditProfileValues } from "@/types";
import { editProfileSchema } from "@/schemas";
import { settings, softDeleteCurrentUser } from "@/actions/user.actions";
import { useCurrentUser } from "@/hooks/use-current-user";

interface SecurityProfileFormProps {
  user: ExtendedUser;
}

export const SecurityProfileForm = ({ user }: SecurityProfileFormProps) => {
  const isEditable = user?.isOAuth === false;

  return (
    <Card className="w-full p-5 max-w-2xl shadow-md mx-auto">
      <CardHeader className="relative flex items-center justify-between">
        <CardTitle className="mx-auto flex items-center gap-2 text-xl text-center">
          <ShieldCheck />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-5">
          <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
            <p className="text-sm font-medium">Username</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.name}
            </p>
          </div>
          <EditUsernameButton />
        </div>
        <div
          className={cn(
            "grid gap-5",
            isEditable ? "grid-cols-[1fr_auto]" : "grid-cols-1"
          )}
        >
          <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
            <p className="text-sm font-medium">Email address</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.email}
            </p>
          </div>
          {isEditable && <EditEmailButton />}
        </div>
        <div
          className={cn(
            "grid gap-5",
            isEditable ? "grid-cols-[1fr_auto]" : "grid-cols-1"
          )}
        >
          <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
            <p className="text-sm font-medium">Password</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              **********
            </p>
          </div>
          {isEditable && <ChangePasswordButton />}
        </div>
        <FormTwoFactorToggle />
        <CardHeader className="relative flex items-center justify-between">
          <CardTitle className="mx-auto flex items-stretch gap-2 text-xl text-center text-destructive">
            <TriangleAlert />
            Danger zone
          </CardTitle>
        </CardHeader>
        <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
          <p className="text-sm font-semibold text-destructive">
            Deactivate account
          </p>
          <DeactivateAccountBtn />
        </div>
      </CardContent>
    </Card>
  );
};

const DeactivateAccountBtn = () => {
  const router = useRouter();
  const [openDlg, setOpenDlg] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeactivate = () =>
    startTransition(async () => {
      const res = await softDeleteCurrentUser();
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success(res?.success ?? "Account deactivated");

      try {
        await signOut({ callbackUrl: "/" });
      } catch {
        router.replace("/");
        setOpenDlg(false);
      }
    });

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        title="Deactivate"
        aria-label="Deactivate account"
        disabled={isPending}
        className="cursor-pointer"
        onClick={() => setOpenDlg(true)}
      >
        Deactivate
      </Button>

      <ConfirmDeleteDialog
        isOpen={openDlg}
        onOpenChange={setOpenDlg}
        title="Confirm account deactivation"
        description="Are you sure you want to deactivate your account? After this, you won’t be able to log in on your own. Account recovery is only possible upon prior request to the site administration."
        confirmText="Deactivate"
        cancelText="Cancel"
        loading={isPending}
        onConfirm={async () => {
          await handleDeactivate();
          setOpenDlg(false);
        }}
      />
    </>
  );
};

const EditUsernameButton = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const onSubmit = (values: EditProfileValues) => {
    startTransition(() => {
      settings(values)
        .then(async (res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success(res.success ?? "Username updated");
          await update();
          setOpen(false);
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  return (
    <>
      <Button
        variant="outline"
        type="button"
        className="aspect-square cursor-pointer"
        title="Change username"
        aria-label="Change username"
        onClick={() => setOpen(true)}
      >
        <FilePenLine />
      </Button>

      <EditProfileDialog isOpen={open} onOpenChange={setOpen}>
        <Card>
          <CardHeader>
            <CardTitle>Change username</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormInput
                  id="name"
                  name="name"
                  label="Name"
                  placeholder="John Doe"
                  disabled={isPending}
                  required
                />
                <div className="mt-10 flex items-center gap-5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="flex-1 cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isPending}
                    className="flex-1 cursor-pointer"
                  >
                    {isPending ? "Updating..." : "Confirm"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </EditProfileDialog>
    </>
  );
};

const EditEmailButton = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      email: user?.email ?? "",
    },
  });

  const onSubmit = (values: EditProfileValues) => {
    startTransition(() => {
      settings(values)
        .then(async (res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success(res.success ?? "Email updated");
          await update();
          setOpen(false);
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  return (
    <>
      <Button
        variant="outline"
        type="button"
        className="aspect-square cursor-pointer"
        title="Change email"
        aria-label="Change email"
        onClick={() => setOpen(true)}
      >
        <FilePenLine />
      </Button>

      <EditProfileDialog isOpen={open} onOpenChange={setOpen}>
        <Card>
          <CardHeader>
            <CardTitle>Change email address</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormInput
                  id="email"
                  name="email"
                  label="Email address"
                  placeholder="your.email@example.com"
                  disabled={isPending}
                  required
                />
                <div className="mt-10 flex items-center gap-5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="flex-1 cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isPending}
                    className="flex-1 cursor-pointer"
                  >
                    {isPending ? "Updating..." : "Confirm"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </EditProfileDialog>
    </>
  );
};

const ChangePasswordButton = () => {
  const [open, setOpen] = useState(false);
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
    },
  });

  const onSubmit = (values: EditProfileValues) => {
    startTransition(() => {
      settings(values)
        .then(async (res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }
          toast.success(res.success ?? "Password updated");
          await update();
          setOpen(false);
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again.");
        });
    });
  };

  return (
    <>
      <Button
        variant="outline"
        type="button"
        className="aspect-square cursor-pointer"
        title="Change password"
        aria-label="Change password"
        onClick={() => setOpen(true)}
      >
        <FilePenLine />
      </Button>

      <EditProfileDialog isOpen={open} onOpenChange={setOpen}>
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormInput
                  id="password"
                  name="password"
                  label="Current password"
                  placeholder="******"
                  type="password"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="newPassword"
                  name="newPassword"
                  label="New password"
                  placeholder="******"
                  type="password"
                  disabled={isPending}
                  required
                />
                <div className="mt-10 flex items-center gap-5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="flex-1 cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isPending}
                    className="flex-1 cursor-pointer"
                  >
                    {isPending ? "Updating..." : "Confirm"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </EditProfileDialog>
    </>
  );
};
