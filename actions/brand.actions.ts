"use server";

import slugify from "slugify";
import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma/prisma";
import { handleUnknownError } from "@/lib/utils";
import { createBrandSchema, editBrandSchema } from "@/schemas";

export const createBrand = async (data: unknown) => {
  try {
    const parsed = createBrandSchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: "Invalid brand data",
      };
    }

    const { name } = parsed.data;

    const slug = slugify(name, { lower: true, strict: true });

    const existingBrand = await prisma.brand.findUnique({ where: { slug } });

    if (existingBrand) {
      return {
        error: "Brand with this name already exists",
      };
    }

    await prisma.brand.create({ data: { name, slug } });

    revalidatePath("/brands");

    return { success: "Brand created" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const editBrand = async (id: string, data: unknown) => {
  try {
    const parsed = editBrandSchema.safeParse(data);

    if (!parsed.success) {
      return {
        error: "Invalid brand data",
      };
    }

    const { name } = parsed.data;

    const slug = slugify(name, { lower: true, strict: true });

    const brandToUpdate = await prisma.brand.findUnique({ where: { id } });

    if (!brandToUpdate) {
      return {
        error: "Brand not found",
      };
    }

    if (slug !== brandToUpdate.slug) {
      const existingBrand = await prisma.brand.findUnique({ where: { slug } });

      if (existingBrand) {
        return {
          error: "Brand with this name already exists",
        };
      }
    }

    await prisma.brand.update({
      where: { id },
      data: { name, slug },
    });

    revalidatePath("/brands");

    return { success: "Brand updated" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const deleteBrand = async (id: string) => {
  try {
    const productsUsingBrand = await prisma.product.findFirst({
      where: { brandId: id },
    });

    if (productsUsingBrand) {
      return {
        error:
          "Brand is used in at least one product. Please remove the brand from all products before deleting it.",
      };
    }

    await prisma.brand.delete({ where: { id } });

    revalidatePath("/brands");

    return { success: "Brand deleted" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const getBrands = async () => {
  return await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });
};
