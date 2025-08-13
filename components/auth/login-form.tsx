"use client";

import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { FormInput } from "@/components/form-input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { loginSchema } from "@/schemas";
import { login } from "@/actions/user.actions";

export const LoginForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setSuccess(undefined);
          } else if (data.success) {
            setSuccess(data.success);
            toast.success(data.success);
            setError(undefined);
            form.reset();
          } else if (data.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => {
          setError("Something went wrong. Please try again.");
          setSuccess(undefined);
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {showTwoFactor && (
            <FormInput
              name="code"
              id="code"
              label="2FA code"
              placeholder="123456"
              required
              disabled={isPending}
            />
          )}

          {!showTwoFactor && (
            <>
              <FormInput
                name="email"
                id="email"
                label="Email"
                placeholder="your_email@example.com"
                required
                disabled={isPending}
              />
              <div>
                <FormInput
                  name="password"
                  id="password"
                  label="Password"
                  placeholder="********"
                  required
                  disabled={isPending}
                />
                <Link
                  href="/auth/reset"
                  className={cn(
                    buttonVariants({ variant: "link", size: "sm" }),
                    "px-0 font-normal justify-start"
                  )}
                >
                  Forgot password?
                </Link>
              </div>
            </>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />
          {showTwoFactor && (
            <Button type="submit" className="w-full cursor-pointer" size="lg">
              {isPending ? "Confirming..." : "Confirm"}
            </Button>
          )}
          {!showTwoFactor && (
            <Button type="submit" className="w-full cursor-pointer" size="lg">
              {isPending ? "Logging in..." : "Log in"}
            </Button>
          )}
        </form>
      </FormProvider>
    </CardWrapper>
  );
};
