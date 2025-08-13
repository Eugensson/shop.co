export const publicRoutes = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/cart",
  "/contact",
  "/new-arrivals",
  "/product",
  "/product/[slug]",
  "/sale",
  "/sale/[slug]",
  "/shop",
  "/wishlist",
  "/auth/new-verification",
];

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/profile";
