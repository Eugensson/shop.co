"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma/prisma";
import { ProductWithRelations } from "@/types";
import { handleUnknownError } from "@/lib/utils";
import { generateSlugIfNeeded } from "@/lib/generateSlug";
import { deleteImagesFromCloudinary } from "@/lib/uploadImage";
import { processUploadedImages } from "@/lib/processUploadedImages";
import { createProductSchema, editProductSchema, idSchema } from "@/schemas";

export const createProduct = async (formData: FormData) => {
  try {
    const json = formData.get("json");

    if (!json || typeof json !== "string") {
      return { error: "Missing product data" };
    }

    let raw;

    try {
      raw = JSON.parse(json);
    } catch {
      return { error: "Invalid JSON format" };
    }

    const parsed = createProductSchema.safeParse(raw);

    if (!parsed.success) {
      console.log("Validation errors:", parsed.error.format());
      return { error: "Invalid product data!", issues: parsed.error.format() };
    }

    const {
      name,
      sku,
      description,
      dressStyle,
      categoryId,
      brandId,
      gender,
      variants,
    } = parsed.data;

    const slug = await generateSlugIfNeeded(name, "product");

    const images = formData.getAll("images") as File[];

    const isMainFlags = images.map((_, idx) => {
      const val = formData.get(`isMain-${idx}`);
      return val === "true";
    });

    const imagesWithMain = images.map((file, idx) => ({
      file,
      isMain: isMainFlags[idx] ?? false,
    }));

    const imgResult = await processUploadedImages(imagesWithMain);

    if ("error" in imgResult) return { error: imgResult.error };

    const variantsWithDiscounted = variants.map((v) => {
      const discountedPrice = v.discount
        ? +(v.price * (1 - v.discount / 100)).toFixed(2)
        : v.price;
      return { ...v, discountedPrice };
    });

    const minPrice = Math.min(
      ...variantsWithDiscounted.map((v) => v.discountedPrice)
    );
    const maxPrice = Math.max(...variantsWithDiscounted.map((v) => v.price));

    await prisma.product.create({
      data: {
        name,
        sku,
        slug,
        description,
        dressStyle,
        categoryId,
        brandId,
        gender,
        minPrice,
        maxPrice,
        variants: {
          create: variantsWithDiscounted.map((variant) => ({
            color: { connect: { id: variant.colorId } },
            size: { connect: { id: variant.sizeId } },
            quantity: variant.quantity,
            price: variant.price,
            discount: variant.discount ?? 0,
            discountedPrice: variant.discountedPrice,
          })),
        },
        images: {
          create: imgResult.images.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            isMain: img.isMain,
          })),
        },
      },
      include: { variants: true },
    });

    revalidatePath("/products");

    return { success: "Product created" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const editProduct = async (formData: FormData) => {
  try {
    const raw = Object.fromEntries(formData.entries());

    const productId = raw.productId as string;
    if (!productId) return { error: "Missing product ID" };

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true, variants: true },
    });
    if (!existingProduct) return { error: "Product not found" };

    try {
      raw.variants = JSON.parse(raw.variants as string);
    } catch {
      return { error: "Invalid variants format" };
    }

    const parsed = editProductSchema.safeParse(raw);
    if (!parsed.success) return { error: "Invalid product data" };
    const data = parsed.data;

    const existingImageIds: string[] = [];
    const isMainExistingFlags: boolean[] = [];

    for (let i = 0; ; i++) {
      const id = formData.get(`existingImageId-${i}`);
      if (!id) break;
      existingImageIds.push(String(id));
      const isMainFlag = formData.get(`isMain-existing-${i}`);
      isMainExistingFlags.push(isMainFlag === "true");
    }

    const newImages = formData.getAll("images") as File[];
    const isMainNewFlags: boolean[] = [];
    for (let i = 0; i < newImages.length; i++) {
      const isMainFlag = formData.get(`isMain-new-${i}`);
      isMainNewFlags.push(isMainFlag === "true");
    }

    const oldImagePublicIds = existingProduct.images.map((img) => img.publicId);
    const toKeepImageIds = existingImageIds;
    const toDeleteImageIds = oldImagePublicIds.filter(
      (id) => !toKeepImageIds.includes(id)
    );

    await prisma.productImage.deleteMany({
      where: {
        productId,
        publicId: { notIn: toKeepImageIds },
      },
    });

    if (toDeleteImageIds.length > 0) {
      await deleteImagesFromCloudinary(toDeleteImageIds);
    }

    const imagesForUpdate = await prisma.productImage.findMany({
      where: {
        productId,
        publicId: { in: existingImageIds },
      },
      select: { id: true, publicId: true },
    });

    for (let i = 0; i < existingImageIds.length; i++) {
      const img = imagesForUpdate.find(
        (img) => img.publicId === existingImageIds[i]
      );
      if (img) {
        await prisma.productImage.update({
          where: { id: img.id },
          data: { isMain: isMainExistingFlags[i] },
        });
      }
    }

    let newProcessedImages = null;
    if (newImages.length > 0) {
      const imagesWithMain = newImages.map((file, idx) => ({
        file,
        isMain: isMainNewFlags[idx] ?? false,
      }));

      const result = await processUploadedImages(imagesWithMain);
      if ("error" in result) return { error: result.error };
      newProcessedImages = result.images;
    }

    if (newProcessedImages) {
      await prisma.productImage.createMany({
        data: newProcessedImages.map((img) => ({
          productId,
          url: img.url,
          publicId: img.publicId,
          isMain: img.isMain,
        })),
      });
    }

    const allImages = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { isMain: "desc" },
    });

    if (!allImages.some((img) => img.isMain) && allImages.length > 0) {
      await prisma.productImage.update({
        where: { id: allImages[0].id },
        data: { isMain: true },
      });
    } else if (allImages.filter((img) => img.isMain).length > 1) {
      const [, ...others] = allImages.filter((img) => img.isMain);
      await Promise.all(
        others.map((img) =>
          prisma.productImage.update({
            where: { id: img.id },
            data: { isMain: false },
          })
        )
      );
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description,
        categoryId: data.categoryId,
        brandId: data.brandId,
        gender: data.gender,
        dressStyle: data.dressStyle,
      },
    });

    const variantsFromForm = data.variants;

    const variantsWithDiscounted = variantsFromForm.map((v) => {
      const discountedPrice = v.discount
        ? +(v.price * (1 - v.discount / 100)).toFixed(2)
        : v.price;
      return { ...v, discountedPrice };
    });

    const minPrice = Math.min(
      ...variantsWithDiscounted.map((v) => v.discountedPrice)
    );
    const maxPrice = Math.max(...variantsWithDiscounted.map((v) => v.price));

    const existingVariants = await prisma.productVariant.findMany({
      where: { productId },
    });
    const formVariantIds = variantsFromForm
      .map((v) => v.id)
      .filter((id): id is string => !!id);
    const variantsToDelete = existingVariants
      .filter((v) => !formVariantIds.includes(v.id))
      .map((v) => v.id);
    if (variantsToDelete.length > 0) {
      await prisma.productVariant.deleteMany({
        where: { id: { in: variantsToDelete } },
      });
    }

    for (const variant of variantsWithDiscounted.filter((v) => v.id)) {
      await prisma.productVariant.update({
        where: { id: variant.id! },
        data: {
          colorId: variant.colorId,
          sizeId: variant.sizeId,
          quantity: variant.quantity,
          price: variant.price,
          discount: variant.discount ?? 0,
          discountedPrice: variant.discountedPrice,
        },
      });
    }

    const newVariants = variantsWithDiscounted.filter((v) => !v.id);
    if (newVariants.length > 0) {
      await prisma.productVariant.createMany({
        data: newVariants.map((v) => ({
          productId,
          colorId: v.colorId,
          sizeId: v.sizeId,
          quantity: v.quantity,
          price: v.price,
          discount: v.discount ?? 0,
          discountedPrice: v.discountedPrice,
        })),
      });
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        minPrice,
        maxPrice,
      },
    });

    return { success: "Product updated" };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const toggleArchiveProduct = async (productId: string) => {
  const parsed = idSchema.safeParse(productId);

  if (!parsed.success) {
    return { error: "Invalid product ID" };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { isArchived: true },
    });

    if (!product) return { error: "Product not found" };

    await prisma.product.update({
      where: { id: productId },
      data: { isArchived: !product.isArchived },
    });

    revalidatePath("/products");

    return {
      success: product.isArchived
        ? "Product unarchived successfully"
        : "Product archived successfully",
    };
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    if (!slug) return null;

    const product = await prisma.product.findFirst({
      where: { slug, isArchived: false },
      include: {
        brand: true,
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        variants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    if (!product) return null;

    return product;
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

export const getProductBySlugWithDiscount = async (slug: string) => {
  try {
    if (!slug) return null;

    const product = await prisma.product.findFirst({
      where: { slug, isArchived: false },
      include: {
        brand: true,
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        variants: {
          where: {
            discount: { gt: 0 },
          },
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    if (!product) return null;

    return product;
  } catch (error: unknown) {
    return handleUnknownError(error);
  }
};

interface GetProductsParams {
  page: number;
  limit: number;
  sort: string;
  size?: string | null;
  color?: string | null;
  dressStyle?: string | null;
  minPrice?: number;
  maxPrice?: number;
  brand?: string | null;
  category?: string | null;
  gender?: string | null;
}

export const getProducts = async ({
  page,
  limit,
  sort,
  size,
  color,
  dressStyle,
  minPrice = 0,
  maxPrice = 999999,
  brand,
  category,
  gender,
}: GetProductsParams) => {
  const skip = (page - 1) * limit;

  const [colorId, sizeId, brandId, categoryId] = await Promise.all([
    color
      ? prisma.color
          .findUnique({ where: { slug: color }, select: { id: true } })
          .then((c) => c?.id ?? null)
      : null,
    size
      ? prisma.size
          .findUnique({ where: { slug: size }, select: { id: true } })
          .then((s) => s?.id ?? null)
      : null,
    brand
      ? prisma.brand
          .findUnique({ where: { slug: brand }, select: { id: true } })
          .then((b) => b?.id ?? null)
      : null,
    category
      ? prisma.category
          .findUnique({ where: { slug: category }, select: { id: true } })
          .then((c) => c?.id ?? null)
      : null,
  ]);

  let productIds: string[] | null = null;

  if (colorId || sizeId) {
    const variantFilter: any = {
      quantity: { gt: 0 },
      ...(colorId ? { colorId } : {}),
      ...(sizeId ? { sizeId } : {}),
    };

    const variants = await prisma.productVariant.findMany({
      where: variantFilter,
      select: { productId: true },
    });

    productIds = [...new Set(variants.map((v) => v.productId))];
  }

  let orderBy: any = { createdAt: "desc" };

  switch (sort) {
    case "most-popular":
    case "best-selling":
      orderBy = { avgRating: "desc" };
      break;
    case "newest-arrivals":
      orderBy = { createdAt: "desc" };
      break;
    case "price-high-to-low":
      orderBy = { maxPrice: "desc" };
      break;
    case "price-low-to-high":
      orderBy = { minPrice: "asc" };
      break;
  }

  const where: any = {
    isArchived: false,
    minPrice: { gte: minPrice },
    maxPrice: { lte: maxPrice },
    ...(dressStyle && { dressStyle }),
    ...(productIds ? { id: { in: productIds } } : {}),
  };

  if (gender) where.gender = gender;
  if (brandId) where.brandId = brandId;
  if (categoryId) where.categoryId = categoryId;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where,
      include: {
        images: true,
        brand: true,
        category: true,
        variants: true,
      },
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    products,
    totalCount,
    totalPages,
    currentPage: page,
  };
};

interface getNewArrivalProductsParams {
  page: number;
  limit: number;
  sort: string;
  size?: string | null;
  color?: string | null;
  dressStyle?: string | null;
  minPrice?: number;
  maxPrice?: number;
  brand?: string | null;
  category?: string | null;
  gender?: string | null;
}

export const getNewArrivalProducts = async ({
  page,
  limit,
  sort,
  size,
  color,
  dressStyle,
  minPrice = 0,
  maxPrice = 999999,
  brand,
  category,
  gender,
}: getNewArrivalProductsParams) => {
  const skip = (page - 1) * limit;

  const [colorId, sizeId, brandId, categoryId] = await Promise.all([
    color
      ? prisma.color
          .findUnique({ where: { slug: color }, select: { id: true } })
          .then((c) => c?.id ?? null)
      : null,
    size
      ? prisma.size
          .findUnique({ where: { slug: size }, select: { id: true } })
          .then((s) => s?.id ?? null)
      : null,
    brand
      ? prisma.brand
          .findUnique({ where: { slug: brand }, select: { id: true } })
          .then((b) => b?.id ?? null)
      : null,
    category
      ? prisma.category
          .findUnique({ where: { slug: category }, select: { id: true } })
          .then((c) => c?.id ?? null)
      : null,
  ]);

  let productIds: string[] | null = null;

  if (colorId || sizeId) {
    const variantFilter: any = {
      quantity: { gt: 0 },
      ...(colorId ? { colorId } : {}),
      ...(sizeId ? { sizeId } : {}),
    };

    const variants = await prisma.productVariant.findMany({
      where: variantFilter,
      select: { productId: true },
    });

    productIds = [...new Set(variants.map((v) => v.productId))];
  }

  let orderBy: any = { createdAt: "desc" };

  switch (sort) {
    case "most-popular":
    case "best-selling":
      orderBy = { avgRating: "desc" };
      break;
    case "newest-arrivals":
      orderBy = { createdAt: "desc" };
      break;
    case "price-high-to-low":
      orderBy = { maxPrice: "desc" };
      break;
    case "price-low-to-high":
      orderBy = { minPrice: "asc" };
      break;
  }

  const where: any = {
    isNewArrival: true,
    isArchived: false,
    minPrice: { gte: minPrice },
    maxPrice: { lte: maxPrice },
    ...(dressStyle && { dressStyle }),
    ...(productIds ? { id: { in: productIds } } : {}),
  };

  if (gender) where.gender = gender;
  if (brandId) where.brandId = brandId;
  if (categoryId) where.categoryId = categoryId;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where,
      include: {
        images: true,
        brand: true,
        category: true,
        variants: true,
      },
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    products,
    totalCount,
    totalPages,
    currentPage: page,
  };
};

interface getSaleProductsParams {
  page: number;
  limit: number;
  sort: string;
  size?: string | null;
  color?: string | null;
  dressStyle?: string | null;
  minPrice?: number;
  maxPrice?: number;
  brand?: string | null;
  category?: string | null;
  gender?: string | null;
}

export const getSaleProducts = async ({
  page,
  limit,
  sort,
  size,
  color,
  dressStyle,
  minPrice = 0,
  maxPrice = 999999,
  brand,
  category,
  gender,
}: getSaleProductsParams) => {
  const skip = (page - 1) * limit;

  const [colorId, sizeId, brandId, categoryId] = await Promise.all([
    color
      ? prisma.color
          .findUnique({ where: { slug: color }, select: { id: true } })
          .then((c) => c?.id ?? null)
      : null,
    size
      ? prisma.size
          .findUnique({ where: { slug: size }, select: { id: true } })
          .then((s) => s?.id ?? null)
      : null,
    brand
      ? prisma.brand
          .findUnique({ where: { slug: brand }, select: { id: true } })
          .then((b) => b?.id ?? null)
      : null,
    category
      ? prisma.category
          .findUnique({ where: { slug: category }, select: { id: true } })
          .then((c) => c?.id ?? null)
      : null,
  ]);

  let productIds: string[] | null = null;

  if (colorId || sizeId) {
    const variantFilter: any = {
      discount: { gt: 0 },
      ...(colorId && { colorId }),
      ...(sizeId && { sizeId }),
    };

    const variants = await prisma.productVariant.findMany({
      where: variantFilter,
      select: { productId: true },
    });

    productIds = [...new Set(variants.map((v) => v.productId))];
  }

  let orderBy: any = { createdAt: "desc" };

  switch (sort) {
    case "most-popular":
    case "best-selling":
      orderBy = { avgRating: "desc" };
      break;
    case "newest-arrivals":
      orderBy = { createdAt: "desc" };
      break;
    case "price-high-to-low":
      orderBy = { maxPrice: "desc" };
      break;
    case "price-low-to-high":
      orderBy = { minPrice: "asc" };
      break;
  }

  const where: any = {
    isArchived: false,
    variants: {
      some: {
        discount: { gt: 0 },
      },
    },
    minPrice: { gte: minPrice },
    maxPrice: { lte: maxPrice },
    ...(dressStyle && { dressStyle }),
    ...(productIds ? { id: { in: productIds } } : {}),
    ...(gender && { gender }),
    ...(brandId && { brandId }),
    ...(categoryId && { categoryId }),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include: {
        images: true,
        brand: true,
        category: true,
        variants: {
          where: {
            discount: { gt: 0 },
            ...(colorId && { colorId }),
            ...(sizeId && { sizeId }),
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    products,
    totalCount,
    totalPages,
    currentPage: page,
  };
};

export const getWishlistProducts = async (
  ids: string[]
): Promise<ProductWithRelations[]> => {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const validIds = ids.filter((id) => /^[0-9a-fA-F]{24}$/.test(id));

  if (validIds.length === 0) return [];

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: validIds }, isArchived: false },
      include: {
        brand: true,
        category: true,
        images: { where: { isMain: true } },
        variants: true,
      },
    });

    return products;
  } catch (error) {
    console.error("getWishlistProducts error:", error);
    return [];
  }
};

export const getReletedProducts = async (product: ProductWithRelations) => {
  try {
    if (!product) return [];

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isArchived: false,
        id: {
          not: product.id,
        },
      },
      include: {
        brand: true,
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        variants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
      take: 4,
    });

    if (!relatedProducts) return [];

    return relatedProducts;
  } catch (error) {
    console.error("getReletedProducts error:", error);
    return [];
  }
};

export const getViewedProducts = async (
  ids: string[]
): Promise<ProductWithRelations[]> => {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const validIds = ids.filter((id) => /^[0-9a-fA-F]{24}$/.test(id));

  if (validIds.length === 0) return [];

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: validIds }, isArchived: false },
      include: {
        brand: true,
        category: true,
        images: { where: { isMain: true } },
        variants: true,
      },
    });

    return products;
  } catch (error) {
    console.error("getViewedProducts error:", error);
    return [];
  }
};
