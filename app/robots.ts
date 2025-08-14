import type { MetadataRoute } from "next";

const domain = process.env.NEXT_PUBLIC_APP_URL || "https://shop.co";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/brands",
        "/brands/*",
        "/categories",
        "/categories/*",
        "/colors",
        "/colors/*",
        "/dashboard",
        "/notifications",
        "/notifications/*",
        "/orders",
        "/orders/*",
        "/products",
        "/products/*",
        "/reviews",
        "/sizes",
        "/sizes/*",
        "/users",
        "/auth",
        "/auth/error",
        "/auth/login",
        "/auth/new-password",
        "/auth/new-verification",
        "/auth/register",
        "/auth/reset",
        "/profile",
        "/profile/*",
        "/wishlist",
        "/cart",
        "/checkout",
      ],
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
