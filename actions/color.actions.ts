"use server";

import slugify from "slugify";
import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma/prisma";
import { handleUnknownError } from "@/lib/utils";
import { createColorSchema, editColorSchema } from "@/schemas";

export const createColor = async (data: unknown) => {
  try {
    const parsed = createColorSchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: "Invalid color data",
      };
    }

    const { name, hex } = parsed.data;

    const slug = slugify(name, { lower: true, strict: true });

    const existingColor = await prisma.color.findUnique({ where: { slug } });

    if (existingColor) {
      return {
        error: "Color with this name already exists",
      };
    }

    await prisma.color.create({ data: { name, slug, hex } });

    revalidatePath("/colors");

    return { success: "Color created" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const editColor = async (id: string, data: unknown) => {
  try {
    const parsed = editColorSchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: "Invalid color data",
      };
    }

    const { name, hex } = parsed.data;

    const slug = slugify(name, { lower: true, strict: true });

    const colorToUpdate = await prisma.color.findUnique({ where: { id } });

    if (!colorToUpdate) {
      return {
        error: "Color not found",
      };
    }

    if (slug !== colorToUpdate.slug) {
      const existingColor = await prisma.color.findUnique({ where: { slug } });

      if (existingColor) {
        return {
          error: "Color with this name already exists",
        };
      }
    }

    await prisma.color.update({
      where: { id },
      data: { name, slug, hex },
    });

    revalidatePath("/colors");

    return { success: "Color updated" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const deleteColor = async (id: string) => {
  try {
    const variantsUsingColor = await prisma.productVariant.findFirst({
      where: { colorId: id },
    });

    if (variantsUsingColor) {
      return {
        error:
          "Color is used in at least one product variant. Please remove the color from all product variants before deleting it.",
      };
    }

    await prisma.color.delete({ where: { id } });

    revalidatePath("/colors");

    return { success: "Color deleted" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const getColors = async () => {
  return await prisma.color.findMany({
    orderBy: { name: "asc" },
  });
};
