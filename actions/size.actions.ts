"use server";

import slugify from "slugify";
import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma/prisma";
import { handleUnknownError } from "@/lib/utils";
import { createSizeSchema, editSizeSchema } from "@/schemas";

export const createSize = async (data: unknown) => {
  try {
    const parsed = createSizeSchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: "Invalid size data",
      };
    }

    const { name, value } = parsed.data;

    const slug = slugify(name, { lower: true, strict: true });

    const existingSize = await prisma.size.findUnique({ where: { slug } });

    if (existingSize) {
      return {
        error: "Size with this name already exists",
      };
    }

    await prisma.size.create({ data: { name, slug, value } });

    revalidatePath("/sizes");

    return { success: "Size created" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const editSize = async (id: string, data: unknown) => {
  try {
    const parsed = editSizeSchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: "Invalid size data",
      };
    }

    const { name, value } = parsed.data;

    const slug = slugify(name, { lower: true, strict: true });

    const sizeToUpdate = await prisma.size.findUnique({ where: { id } });

    if (!sizeToUpdate) {
      return {
        error: "Size not found",
      };
    }

    if (slug !== sizeToUpdate.slug) {
      const existingSize = await prisma.size.findUnique({ where: { slug } });

      if (existingSize) {
        return {
          error: "Size with this name already exists",
        };
      }
    }

    await prisma.size.update({
      where: { id },
      data: { name, slug, value },
    });

    revalidatePath("/sizes");

    return { success: "Size updated" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const deleteSize = async (id: string) => {
  try {
    const variantsUsingSize = await prisma.productVariant.findFirst({
      where: { sizeId: id },
    });

    if (variantsUsingSize) {
      return {
        error:
          "Size is used in at least one product variant. Please remove the size from all product variants before deleting it.",
      };
    }

    await prisma.size.delete({ where: { id } });

    revalidatePath("/sizes");

    return { success: "Size deleted" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const getSizes = async () => {
  return await prisma.size.findMany({
    orderBy: { name: "asc" },
  });
};
