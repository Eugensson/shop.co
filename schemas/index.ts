import {
  DressStyle,
  Gender,
  DeliveryMethod,
  PaymentMethod,
  UserRole,
} from "@prisma/client";
import * as z from "zod";

export const idSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ID" });

export const stringTrimmed = (min = 1, max = 100, field = "Field") =>
  z
    .string()
    .min(min, { message: `${field} must be at least ${min} characters` })
    .max(max, { message: `${field} must be at most ${max} characters` })
    .transform((v) => v.trim());

export const hexTransform = () =>
  z
    .string()
    .trim()
    .transform((val) => {
      const hex = val.replace(/^#/, "");
      return `#${hex}`;
    })
    .refine((val) => /^#([0-9a-fA-F]{6})$/.test(val), {
      message: "Enter exactly 6 hexadecimal characters (e.g. 000000 or ffffff)",
    });

export const nullablePassword = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const emailSchema = z
  .email({ message: "Invalid email address" })
  .min(1, { message: "Email is required" });

export const phoneSchema = z
  .string()
  .min(10, { message: "Please enter your full phone number." });

// -----------------------Auth Schemas -----------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
  code: z.string().optional(),
});

export const registerSchema = z.object({
  name: stringTrimmed(3, 100, "Full name"),
  email: emailSchema,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const resetSchema = z.object({ email: emailSchema });

export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const editProfileSchema = z
  .object({
    name: stringTrimmed(3, 100, "Ім’я").optional(),
    email: emailSchema.optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    password: nullablePassword.optional(),
    newPassword: nullablePassword.optional(),
  })
  .refine(
    (d) => (!d.password && !d.newPassword) || (d.password && d.newPassword),
    {
      path: ["password"],
      message: "Password and new password must be provided together",
    }
  );

export const editUserRoleSchema = z.object({
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});

// -----------------------Brand Schemas -----------------------

export const createBrandSchema = z.object({
  name: stringTrimmed(2, 100, "Brand"),
});

export const editBrandSchema = z.object({
  name: stringTrimmed(2, 100, "Brand"),
});

// -----------------------Color Schemas -----------------------

export const createColorSchema = z.object({
  name: stringTrimmed(3, 100, "Color"),
  hex: hexTransform(),
});

export const editColorSchema = z.object({
  name: stringTrimmed(3, 100, "Color"),
  hex: hexTransform(),
});

// -----------------------Size Schemas -----------------------

export const createSizeSchema = z.object({
  name: stringTrimmed(1, 100, "Size"),
  value: z.string(),
});

export const editSizeSchema = z.object({
  name: stringTrimmed(1, 100, "Size"),
  value: z.string(),
});

// -----------------------Category Schemas -----------------------

export const createCategorySchema = z.object({
  name: stringTrimmed(3, 100, "Category"),
});

export const editCategorySchema = z.object({
  name: stringTrimmed(3, 100, "Category"),
});

// -----------------------Product Schemas -----------------------

export const variantSchema = z.object({
  colorId: idSchema,
  sizeId: idSchema,
  quantity: z.number().min(0),
  price: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
});

export const createProductSchema = z.object({
  name: stringTrimmed(3, 100, "Name"),
  sku: z.string(),
  description: z.string(),
  dressStyle: z.enum([
    DressStyle.CASUAL,
    DressStyle.FORMAL,
    DressStyle.PARTY,
    DressStyle.GYM,
  ]),
  categoryId: idSchema,
  brandId: idSchema,
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.UNISEX]),
  variants: z
    .array(variantSchema)
    .min(1, "At least one variant is required")
    .refine(
      (variants) => {
        const seen = new Set();
        for (const variant of variants) {
          const key = `${variant.colorId}-${variant.sizeId}`;
          if (seen.has(key)) return false;
          seen.add(key);
        }
        return true;
      },
      {
        message: "Duplicate variants with same color and size are not allowed",
      }
    ),
});

export const variantEditSchema = z.object({
  id: z.string().optional(),
  colorId: idSchema,
  sizeId: idSchema,
  quantity: z.number().int().min(0),
  price: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
  discountedPrice: z.number().min(0),
});

export const editProductSchema = z.object({
  productId: idSchema,
  name: stringTrimmed(3, 100, "Name"),
  sku: z.string(),
  description: z.string(),
  dressStyle: z.enum([
    DressStyle.CASUAL,
    DressStyle.FORMAL,
    DressStyle.PARTY,
    DressStyle.GYM,
  ]),
  categoryId: idSchema,
  brandId: idSchema,
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.UNISEX]),
  variants: z
    .array(variantEditSchema)
    .min(1, "At least one variant is required")
    .refine(
      (variants) => {
        const seen = new Set();
        for (const variant of variants) {
          const key = `${variant.colorId}-${variant.sizeId}`;
          if (seen.has(key)) return false;
          seen.add(key);
        }
        return true;
      },
      {
        message: "Duplicate variants with same color and size are not allowed",
      }
    ),
});

// -----------------------Order Schemas -----------------------

export const paymentMethodSchema = z.object({
  paymentMethod: z.enum(Object.values(PaymentMethod)),
});

export const deliveryMethodSchema = z.object({
  deliveryMethod: z.enum(Object.values(DeliveryMethod)),
});

const deliveryMethods = [
  "PICKUP_FROM_SHOWROOM",
  "LOGISTICS_COMPANY_SERVICE",
] as const;

const paymentMethods = ["CARD", "CASH", "BANK_TRANSFER"] as const;

export const orderItemInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const deliveryAddressSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  postalCode: z
    .string()
    .trim()
    .min(5, "Postal code must be 5 characters")
    .max(5, "Postal code must be 5 characters"),
  email: z
    .email({ message: "Invalid email address" })
    .trim()
    .min(1, "Email is required"),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Please enter your full phone number." }),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, "At least one item is required"),
  deliveryAddress: deliveryAddressSchema,
  deliveryMethod: z.enum(deliveryMethods),
  paymentMethod: z.enum(paymentMethods),
});

export const editOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  deliveryAddress: deliveryAddressSchema.optional(),
  deliveryMethod: z.enum(deliveryMethods).optional(),
  paymentMethod: z.enum(paymentMethods).optional(),
  isPaid: z.boolean().optional(),
  isDelivered: z.boolean().optional(),
  paidAt: z.date().optional(),
  deliveredAt: z.date().optional(),
});

// -----------------------Notification Schemas -----------------------

export const CreateNotificationSchema = z.object({
  name: stringTrimmed(),
  subject: stringTrimmed(),
  email: emailSchema,
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message must be at most 1000 characters" }),
});

export const EditNotificationSchema = z.object({ notificationId: idSchema });

// -----------------------Review Schemas -----------------------

export const createReviewSchema = z.object({
  productId: idSchema,
  userId: idSchema,
  title: stringTrimmed(),
  comment: stringTrimmed(1, 1000, "Comment"),
  rating: z
    .number()
    .int()
    .min(1, { message: "Minimum 1" })
    .max(5, { message: "Maximum 5" }),
});

export const editReviewSchema = z.object({
  reviewId: idSchema,
  isVerifiedPurchase: z.boolean().optional(),
});
