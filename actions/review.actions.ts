"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma/prisma";
import { handleUnknownError } from "@/lib/utils";
import { createReviewSchema, editReviewSchema } from "@/schemas";

const updateProductRatings = async (productId: string) => {
  const aggregate = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });

  const ratingDistribution = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId },
    _count: true,
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      avgRating: aggregate._avg.rating ?? 0,
      countReviews: aggregate._count,
      ratingDistribution: [1, 2, 3, 4, 5].map((r) => ({
        rating: r,
        count: ratingDistribution.find((g) => g.rating === r)?._count ?? 0,
      })),
    },
  });
};

export const createReview = async (
  values: z.infer<typeof createReviewSchema>
) => {
  const parsed = createReviewSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid fields!" };
  }

  const { productId, userId, title, comment, rating } = parsed.data;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: "Product not found!" };
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: { productId, userId },
      },
    });

    if (existingReview) {
      return { error: "You can only leave one review for this product." };
    }

    await prisma.review.create({
      data: {
        productId,
        userId,
        isVerifiedPurchase: false,
        title,
        comment,
        rating,
      },
    });

    await updateProductRatings(productId);

    revalidatePath(`/product/${product.slug}`);
    return { success: "Review created!" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const editVerifiedPurchaseInReview = async (reviewId: string) => {
  const parsed = editReviewSchema.safeParse({ reviewId });

  if (!parsed.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existing) {
      return { error: "Review not found!" };
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        isVerifiedPurchase: !existing.isVerifiedPurchase,
      },
    });

    revalidatePath("/reviews");
    return { success: "Purchase status updated!", review: updated };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      return { error: "Review not found!" };
    }

    await prisma.review.delete({ where: { id: reviewId } });

    await updateProductRatings(review.productId);

    revalidatePath(`/product/${review.productId}`);
    revalidatePath(`/reviews`);
    return { success: "Review deleted!" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};
