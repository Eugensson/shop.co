import * as z from "zod";
import { Prisma } from "@prisma/client";

import {
  editOrderSchema,
  editProfileSchema,
  loginSchema,
  registerSchema,
} from "@/schemas";
import { DeliveryMethod, PaymentMethod } from "@/constants";

export type LoginValues = z.infer<typeof loginSchema>;

export type RegisterValues = z.infer<typeof registerSchema>;

export type EditProfileValues = z.infer<typeof editProfileSchema>;

export type EditPaymentStatusValues = Pick<
  z.infer<typeof editOrderSchema>,
  "orderId" | "isPaid"
>;

export type EditDeliveryStatusValues = Pick<
  z.infer<typeof editOrderSchema>,
  "orderId" | "isDelivered"
>;

export type EditPaymentDateValues = Pick<
  z.infer<typeof editOrderSchema>,
  "orderId" | "paidAt"
>;

export type EditDeliveryDateValues = Pick<
  z.infer<typeof editOrderSchema>,
  "orderId" | "deliveredAt"
>;

export type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Product = {
  title: string;
  slug: string;
  description: string;
  images: string[];
  colors: { name: string; value: string }[];
  sizes: { name: string; value: string }[];
  price: number;
  discountedPrice: number;
  discount: number;
  avgRating: number;
  quantity: number;
  reviews: Review[];
};

export type SlugModel = "brand" | "category" | "color" | "size" | "product";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  size: string;
  sizeId: string;
  color: string;
  colorId: string;
  quantity: number;
  discount: number;
  price: number;
  discountedPrice: number;
  countInStock: number;
  imageUrl: string;
};

export type DeliveryAddress = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
};

export type Cart = {
  items: CartItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: DeliveryAddress;
};

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    brand: true;
    variants: true;
    images: true;
  };
}>;

export type ProductForUI = Prisma.ProductGetPayload<{
  include: {
    category: true;
    brand: true;
    images: true;
    reviews: {
      include: {
        user: {
          select: {
            name: true;
            image: true;
          };
        };
      };
    };
    variants: {
      include: {
        color: true;
        size: true;
      };
    };
  };
}>;

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: true;
    deliveryAddress: true;
    user: true;
  };
}>;
