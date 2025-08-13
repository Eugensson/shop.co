"use client";

import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubmitOrderButton } from "@/components/submit-order-button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import {
  deliveryAddressSchema,
  deliveryMethodSchema,
  paymentMethodSchema,
} from "@/schemas";
import { cn, formatCurrency } from "@/lib/utils";
import { createOrder } from "@/actions/order.actions";
import { useCartService } from "@/hooks/use-cart-store";
import { DELIVERY_FEE, DeliveryMethod, PaymentMethod } from "@/constants";

export const CheckoutForm = () => {
  const {
    items,
    clear,
    increase,
    decrease,
    deliveryAddress,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
    deliveryMethod,
    setDeliveryMethod,
  } = useCartService();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const deliveryAddressForm = useForm<z.infer<typeof deliveryAddressSchema>>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    deliveryAddressForm.reset(deliveryAddress);
  }, [deliveryAddress, deliveryAddressForm]);

  const paymentMethodForm = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentMethod,
    },
  });

  const deliveryMethodForm = useForm<z.infer<typeof deliveryMethodSchema>>({
    resolver: zodResolver(deliveryMethodSchema),
    defaultValues: {
      deliveryMethod,
    },
  });

  const onDeliveryAddressSubmit = (
    values: z.infer<typeof deliveryAddressSchema>
  ) => {
    setDeliveryAddress(values);
  };

  const onPaymentMethodSubmit = (
    values: z.infer<typeof paymentMethodSchema>
  ) => {
    setPaymentMethod(values.paymentMethod as PaymentMethod);
  };

  const onDeliveryMethodSubmit = (
    values: z.infer<typeof deliveryMethodSchema>
  ) => {
    setDeliveryMethod(values.deliveryMethod as DeliveryMethod);
  };

  const selectedPaymentMethod = paymentMethodForm.watch("paymentMethod");

  const selectedDeliveryMethod =
    deliveryMethodForm.watch("deliveryMethod") ?? deliveryMethod;

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalDiscountAmount = items.reduce(
    (acc, item) => acc + (item.price - item.discountedPrice) * item.quantity,
    0
  );

  const isFreeDelivery = subtotal > 100;

  const total =
    selectedDeliveryMethod === DeliveryMethod.PICKUP_FROM_SHOWROOM
      ? subtotal - totalDiscountAmount
      : subtotal - totalDiscountAmount + (isFreeDelivery ? 0 : DELIVERY_FEE);

  const handleSubmitOrder = async () => {
    const [isDeliveryValid, isPaymentValid, isDeliveryMethodValid] =
      await Promise.all([
        deliveryAddressForm.trigger(),
        paymentMethodForm.trigger(),
        deliveryMethodForm.trigger(),
      ]);

    if (!isDeliveryValid || !isPaymentValid || !isDeliveryMethodValid) return;

    startTransition(() => {
      const formData = new FormData();

      formData.append("items", JSON.stringify(items));
      formData.append("deliveryAddress", JSON.stringify(deliveryAddress));
      formData.append("deliveryMethod", deliveryMethod);
      formData.append("paymentMethod", paymentMethod);

      createOrder(formData).then((res) => {
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("Order placed");

          clear();

          router.replace("/profile/order-history");
        }
      });
    });
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-5">
      <div className="space-y-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-secondary text-xl lg:text-2xl">
              1. Enter Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...deliveryAddressForm}>
              <form
                onSubmit={deliveryAddressForm.handleSubmit(
                  onDeliveryAddressSubmit
                )}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <FormInput
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="For example: John"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="For example: Doe"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="address"
                  name="address"
                  label="Address"
                  placeholder="For example: 123 Main St"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="city"
                  name="city"
                  label="City"
                  placeholder="For example: New York"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="state"
                  name="state"
                  label="State"
                  placeholder="For example: NY"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="country"
                  name="country"
                  label="Country"
                  placeholder="For example: USA"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="postalCode"
                  name="postalCode"
                  label="Postal Code"
                  placeholder="For example: 07008"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="For example: john.doe@example.com"
                  disabled={isPending}
                  required
                />
                <FormInput
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  placeholder="For example: 123-456-7890"
                  disabled={isPending}
                  required
                />
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    className="w-full max-w-80 rounded-full cursor-pointer"
                  >
                    Ship to this address
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-secondary text-xl lg:text-2xl">
              2. Choose a Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormProvider {...paymentMethodForm}>
              <form
                onSubmit={paymentMethodForm.handleSubmit(onPaymentMethodSubmit)}
              >
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={(value) => {
                    paymentMethodForm.setValue(
                      "paymentMethod",
                      value as PaymentMethod
                    );
                    setPaymentMethod(value as PaymentMethod);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={PaymentMethod.CASH} id="cash" />
                    <Label htmlFor="cash">Cash</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={PaymentMethod.BANK_TRANSFER}
                      id="bank"
                    />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={PaymentMethod.CARD} id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                </RadioGroup>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-secondary text-xl lg:text-2xl">
              3. Choose a Delivery Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormProvider {...deliveryMethodForm}>
              <form
                onSubmit={deliveryMethodForm.handleSubmit(
                  onDeliveryMethodSubmit
                )}
              >
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onValueChange={(value) => {
                    deliveryMethodForm.setValue(
                      "deliveryMethod",
                      value as DeliveryMethod
                    );
                    setDeliveryMethod(value as DeliveryMethod);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={DeliveryMethod.PICKUP_FROM_SHOWROOM}
                      id="pickup"
                    />
                    <Label htmlFor="pickup">Pickup from Showroom</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={DeliveryMethod.LOGISTICS_COMPANY_SERVICE}
                      id="logistics"
                    />
                    <Label htmlFor="logistics">Logistics Company Service</Label>
                  </div>
                </RadioGroup>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-secondary text-xl lg:text-2xl">
              4. Review Items
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <ScrollArea className="h-60 lg:h-100 pr-4">
              <Table>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={`${item.productId}-${item.sizeId}-${item.colorId}`}
                    >
                      <TableCell className="w-30 font-medium">
                        <div className="relative aspect-square w-25 h-25 lg:w-30 lg:h-30 bg-[#f0eeed] rounded-xl overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-primary space-y-2">
                        <h2 className="text-xl font-bold">{item.name}</h2>
                        <div>
                          <p>
                            Size:&nbsp;
                            <span className="text-muted-foreground capitalize">
                              {item.size}
                            </span>
                          </p>
                          <p>
                            Color:&nbsp;
                            <span className="text-muted-foreground capitalize">
                              {item.color}
                            </span>
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="w-40">
                        <div className="flex items-center justify-center gap-5 rounded-full bg-[#f0f0f0] px-5 py-3 text-sm font-bold">
                          <Button
                            type="button"
                            variant="link"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() =>
                              decrease({
                                productId: item.productId,
                                sizeId: item.sizeId,
                                colorId: item.colorId,
                              })
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            type="button"
                            variant="link"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => increase(item)}
                            disabled={item.quantity >= item.countInStock}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.discount > 0 ? (
                          <p className="text-lg line-through">
                            {formatCurrency(item.price)}
                          </p>
                        ) : null}
                        <strong
                          className={cn(
                            "text-xl font-bold",
                            item.discount > 0
                              ? "text-destructive"
                              : "text-primary"
                          )}
                        >
                          {formatCurrency(item.discountedPrice)}
                        </strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="w-full md:grid md:grid-cols-[2fr_3fr] gap-5">
          <CardContent>
            <SubmitOrderButton
              onSubmit={handleSubmitOrder}
              isPending={isPending}
            />
          </CardContent>
          <CardHeader className="gap-2">
            <CardTitle className="text-xl lg:text-2xl">
              Order Total: {formatCurrency(total)}
            </CardTitle>
            <CardDescription className="text-xs">
              By placing your order, you agree to SHOP.CO&nbsp;
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline-offset-4 hover:underline"
              >
                privacy policy
              </Link>
              &nbsp;and&nbsp;
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline-offset-4 hover:underline"
              >
                terms & conditions
              </Link>
              .
            </CardDescription>
          </CardHeader>
        </Card>
        <Separator className="mt-10" />
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Need help? Check our&nbsp;
            <Link
              href="#"
              className="text-blue-700 underline-offset-4 hover:underline"
            >
              customer support
            </Link>
            &nbsp;or&nbsp;
            <Link
              href="/contact"
              className="text-blue-700 underline-offset-4 hover:underline"
            >
              contact us
            </Link>
            .
          </p>
          <p>
            For an item ordered from NxtAmzn: When you click the 'Place Your
            Order' button, we will send you an e-mail acknowledging receipt of
            your order. Your contract to purchase an item will not be complete
            until we send you an e-mail notifying you that the item has been
            shipped to you.
          </p>
        </div>
      </div>

      <Card className="w-full h-fit">
        <CardContent>
          <SubmitOrderButton
            onSubmit={handleSubmitOrder}
            isPending={isPending}
          />
        </CardContent>
        <CardHeader className="space-y-4">
          <CardDescription className="text-xs text-center">
            By placing your order, you agree to SHOP.CO&nbsp;
            <Link
              href="#"
              className="text-blue-700 underline-offset-4 hover:underline"
            >
              privacy policy
            </Link>
            &nbsp;and&nbsp;
            <Link
              href="#"
              className="text-blue-700 underline-offset-4 hover:underline"
            >
              terms & conditions
            </Link>
            .
          </CardDescription>
          <CardTitle className="text-xl lg:text-2xl capitalize">
            Order Summary
          </CardTitle>
          <CardDescription className="flex items-end justify-between">
            <span>Items:</span>
            <span>{formatCurrency(subtotal)}</span>
          </CardDescription>
          <CardDescription className="flex items-end justify-between">
            <span>Discount:</span>
            <strong className="text-destructive/75">
              -{formatCurrency(totalDiscountAmount)}
            </strong>
          </CardDescription>
          {selectedDeliveryMethod !== DeliveryMethod.PICKUP_FROM_SHOWROOM && (
            <CardDescription className="flex items-end justify-between">
              <span>Delivery Fee:</span>
              {isFreeDelivery ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span>{formatCurrency(DELIVERY_FEE)}</span>
              )}
            </CardDescription>
          )}
          {!isFreeDelivery && (
            <CardDescription className="text-sm text-muted-foreground italic mt-1">
              Add {formatCurrency(100 - subtotal)} more to get&nbsp;
              <span className="text-green-600">free delivery</span>!
            </CardDescription>
          )}
          <Separator />
          <CardTitle className="text-xl flex items-end justify-between">
            <span>Order total:</span>
            <span>{formatCurrency(total)}</span>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
