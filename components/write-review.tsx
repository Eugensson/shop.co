"use client";

import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormInput } from "@/components/form-input";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { createReviewSchema } from "@/schemas";
import { createReview } from "@/actions/review.actions";

interface WriteReviewProps {
  productId: string;
  productSlug: string;
  userId: string;
}

export const WriteReview = ({
  productId,
  userId,
  productSlug,
}: WriteReviewProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedRating, setSelectedRating] = useState<number>(5);

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      productId,
      userId,
      title: "",
      comment: "",
      rating: selectedRating,
    },
  });

  const onSubmit = (values: z.infer<typeof createReviewSchema>) => {
    if (!userId || !productId) return;

    startTransition(() => {
      createReview(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    });
  };

  return (
    <>
      {userId ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-10 rounded-full cursor-pointer"
            )}
          >
            Write a review
          </DialogTrigger>
          <DialogContent className="w-full max-w-lg space-y-2">
            <DialogHeader>
              <DialogTitle className="mb-1">
                Write a review for a customer
              </DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormInput
                  id="title"
                  name="title"
                  label="Title"
                  placeholder="Type your title here."
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="comment"
                  name="comment"
                  label="Comment"
                  placeholder="Type your comment here."
                  disabled={isPending}
                  required
                  textarea
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (from 1 to 5)</FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => {
                            form.setValue("rating", Number(value));
                            setSelectedRating(Number(value));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Rate the product from 1 to 5" />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <SelectItem key={rating} value={String(rating)}>
                                <span>
                                  {rating} {rating === 1 ? "star" : "stars"}
                                </span>{" "}
                                (
                                {[...Array(rating)].map((_, i) => (
                                  <Star
                                    key={`star-${rating}-${i}`}
                                    className="w-4 h-4 fill-yellow-500 text-yellow-500"
                                  />
                                ))}
                                )
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || !form.formState.isValid}
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Leave a review
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Link
          href={`/auth/login?callbackUrl=/product/${productSlug}`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "h-10 rounded-full cursor-pointer"
          )}
        >
          Login to write a review
        </Link>
      )}
    </>
  );
};
