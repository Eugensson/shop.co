import {
  Barcode,
  BellRing,
  Calendar,
  Group,
  Home,
  LayoutDashboard,
  Palette,
  RulerDimensionLine,
  ShieldCheck,
  Tag,
  Users,
  FolderClock,
  Info,
  MessageCircleCode,
} from "lucide-react";
import { DressStyle, Gender, UserRole } from "@prisma/client";

import ckLogo from "@/public/logo_ck.png";
import zaraLogo from "@/public/logo_zara.png";
import gucciLogo from "@/public/logo_gucci.png";
import pradaLogo from "@/public/logo_prada.png";
import versaceLogo from "@/public/logo_versace.png";

export const ROLE_TYPES = [
  { name: "Admin", value: UserRole.ADMIN },
  { name: "User", value: UserRole.USER },
];

export const LOGO_LIST = [
  { name: "Versace", image: versaceLogo },
  { name: "Zara", image: zaraLogo },
  { name: "Gucci", image: gucciLogo },
  { name: "Prada", image: pradaLogo },
  { name: "CalvinKlein", image: ckLogo },
];

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "New arrivals", href: "/new-arrivals" },
  { label: "Sale", href: "/sale" },
  { label: "Contact", href: "/contact" },
];

export const ADMIN_NAV_LINKS = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Brands",
    url: "/brands",
    icon: Tag,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Group,
  },
  {
    title: "Colors",
    url: "/colors",
    icon: Palette,
  },
  {
    title: "Products",
    url: "/products",
    icon: Barcode,
  },
  {
    title: "Sizes",
    url: "/sizes",
    icon: RulerDimensionLine,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: MessageCircleCode,
  },
];

export const DRESS_STYLE_LIST = [
  { name: "casual", value: DressStyle.CASUAL, thumb: "/casual.jpg" },
  { name: "formal", value: DressStyle.FORMAL, thumb: "/formal.jpg" },
  { name: "party", value: DressStyle.PARTY, thumb: "/party.jpg" },
  { name: "gym", value: DressStyle.GYM, thumb: "/gym.jpg" },
];

export const GENDER_LIST = [
  { name: "male", value: Gender.MALE },
  { name: "female", value: Gender.FEMALE },
  { name: "unisex", value: Gender.UNISEX },
];

export const SORT_ORDERS = [
  { value: "most-popular", name: "Most Popular" },
  { value: "newest-arrivals", name: "Newest arrivals" },
  { value: "price-high-to-low", name: "Price: High to low" },
  { value: "price-low-to-high", name: "Price: Low to high" },
  { value: "best-selling", name: "Best selling" },
];

export const PROFILE_LIST = [
  {
    label: "Order History",
    description:
      "View your order history, including payment statuses and delivery tracking for each order.",
    href: "/profile/order-history",
    icon: FolderClock,
  },
  {
    label: "Profile info",
    description:
      "Access your personal details, such as name, email address, and contact information.",
    href: "/profile/info",
    icon: Info,
  },
  {
    label: "Security",
    description:
      "Edit your name, delivery address, phone number, and email. You can also deactivate your account here.",
    href: "/profile/security",
    icon: ShieldCheck,
  },
];

export enum PaymentMethod {
  CARD = "CARD",
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export enum DeliveryMethod {
  PICKUP_FROM_SHOWROOM = "PICKUP_FROM_SHOWROOM",
  LOGISTICS_COMPANY_SERVICE = "LOGISTICS_COMPANY_SERVICE",
}

export const DELIVERY_METHOD_OPTIONS: Record<DeliveryMethod, string> = {
  PICKUP_FROM_SHOWROOM: "Pickup from showroom",
  LOGISTICS_COMPANY_SERVICE: "Logistics company service",
};

export const PAYMENT_METHOD_OPTIONS: Record<PaymentMethod, string> = {
  CASH: "Cash",
  CARD: "Credit/Debit card",
  BANK_TRANSFER: "Bank transfer",
};

export const DELIVERY_FEE = 15;

export const HISTORY_LIMIT = 10;

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const MAX_FILE_SIZE = 1_048_576;

export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / 1024 / 1024;
