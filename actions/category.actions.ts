"use server";

import slugify from "slugify";
import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma/prisma";
import { handleUnknownError } from "@/lib/utils";
import { createCategorySchema, editCategorySchema } from "@/schemas";

export const createCategory = async (data: unknown) => {
  try {
    const parsed = createCategorySchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: "Invalid category data",
      };
    }

    const { name } = parsed.data;

    const slug = slugify(name, { lower: true, strict: true });

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return {
        error: "Category with this name already exists",
      };
    }

    await prisma.category.create({
      data: { name, slug },
    });

    revalidatePath("/categories");

    return { success: "Category created" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const editCategory = async (id: string, data: unknown) => {
  try {
    const parsed = editCategorySchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: "Invalid category data",
      };
    }

    const { name } = parsed.data;

    const slug = slugify(name, { lower: true, strict: true });

    const categoryToUpdate = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryToUpdate) {
      return {
        error: "Category not found",
      };
    }

    if (slug !== categoryToUpdate.slug) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug },
      });

      if (existingCategory) {
        return {
          error: "Category with this name already exists",
        };
      }
    }

    await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    revalidatePath("/categories");

    return { success: "Category updated" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const productsUsingCategory = await prisma.product.findFirst({
      where: { categoryId: id },
    });

    if (productsUsingCategory) {
      return {
        error:
          "Category is used in at least one product. Please remove the category from all products before deleting it.",
      };
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/categories");

    return { success: "Category deleted" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};
