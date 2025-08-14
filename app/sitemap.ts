import type { MetadataRoute } from "next";

import { prisma } from "@/prisma/prisma";

const domain = process.env.NEXT_PUBLIC_APP_URL || "https://shop.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    select: { slug: true, updatedAt: true, images: true },
  });

  const staticRoutes = [
    { url: `${domain}`, changeFrequency: "daily" as const, priority: 1 },
    {
      url: `${domain}/contact`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${domain}/new-arrivals`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${domain}/product`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${domain}/sale`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${domain}/shop`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ].map((route) => ({
    ...route,
    lastModified: new Date(),
  }));

  const productsEntries = products.map((product) => {
    const mainImageUrl = product.images?.[0]?.url;
    return {
      url: `${domain}/product/${product.slug}`,
      lastModified: product.updatedAt ?? new Date(),
      priority: 0.9,
      images: mainImageUrl ? [mainImageUrl] : undefined,
    };
  });

  return [...staticRoutes, ...productsEntries];
}
