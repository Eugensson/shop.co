import slugify from "slugify";

import { prisma } from "@/prisma/prisma";
import type { SlugModel } from "@/types";

export const generateSlugIfNeeded = async (
  name: string,
  model: SlugModel,
  currentSlug?: string
): Promise<string> => {
  const baseSlug = slugify(name.trim(), {
    lower: true,
    strict: true,
    locale: "uk",
  });

  const safeSlug = baseSlug || "item";

  if (currentSlug && safeSlug === currentSlug) {
    return currentSlug;
  }

  const exists = await (prisma[model] as any).findUnique({
    where: { slug: safeSlug },
  });

  if (!exists || exists.slug === currentSlug) {
    return safeSlug;
  }

  let suffix = 1;

  while (true) {
    const newSlug = `${safeSlug}-${suffix}`;
    const existsWithSuffix = await (prisma[model] as any).findUnique({
      where: { slug: newSlug },
    });

    if (!existsWithSuffix || existsWithSuffix.slug === currentSlug) {
      return newSlug;
    }

    suffix++;
  }
};
