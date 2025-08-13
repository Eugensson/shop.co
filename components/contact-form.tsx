"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";

import { CreateNotificationSchema } from "@/schemas";
import { createNotification } from "@/actions/notification.actions";

const ContactForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateNotificationSchema>>({
    resolver: zodResolver(CreateNotificationSchema),
    defaultValues: {
      name: "",
      subject: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateNotificationSchema>) => {
    startTransition(() => {
      createNotification(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
          form.reset();
        }
      });
    });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-8"
      >
        <FormInput
          id="name"
          name="name"
          placeholder="John Doe"
          disabled={isPending}
          required
        />
        <FormInput
          id="email"
          name="email"
          placeholder="your_email@example.com"
          disabled={isPending}
          required
        />
        <FormInput
          id="subject"
          name="subject"
          placeholder="Type your subject here."
          disabled={isPending}
          required
          className="lg:col-span-2"
        />
        <FormInput
          id="message"
          name="message"
          placeholder="Type your message here."
          className="lg:col-span-2"
          disabled={isPending}
          textarea
          required
        />
        <div className="lg:col-span-2 lg:flex lg:justify-center xl:mt-10">
          <Button
            type="submit"
            size="lg"
            className="w-full lg:w-75 rounded-full cursor-pointer"
          >
            Send
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ContactForm;
