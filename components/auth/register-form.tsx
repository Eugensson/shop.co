"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardWrapper } from "@/components/auth/card-wrapper";

import { registerSchema } from "@/schemas";
import { register } from "@/actions/user.actions";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setSuccess(undefined);
          } else if (data.success) {
            setSuccess(data.success);
            toast.success(data.success);
            setError(undefined);
            form.reset();
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
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormInput
            name="name"
            id="name"
            label="Full name"
            placeholder="John Doe"
            required
            disabled={isPending}
          />
          <FormInput
            name="email"
            id="email"
            label="Email"
            placeholder="your_email@example.com"
            required
            disabled={isPending}
          />
          <FormInput
            name="password"
            id="password"
            label="Password"
            placeholder="********"
            required
            disabled={isPending}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full cursor-pointer" size="lg">
            {isPending ? "Creating..." : "Create an account"}
          </Button>
        </form>
      </FormProvider>
    </CardWrapper>
  );
};
