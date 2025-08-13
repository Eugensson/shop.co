"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, Tag, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DELIVERY_FEE } from "@/constants";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartService } from "@/hooks/use-cart-store";

export const CartItemList = () => {
  const router = useRouter();
  const { items, increase, decrease, removeItem } = useCartService();

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
    subtotal -
    totalDiscountAmount +
    (items.length === 0 || isFreeDelivery ? 0 : DELIVERY_FEE);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[4fr_3fr] gap-5">
      <Card>
        <CardContent>
          <ScrollArea className="w-full h-98 lg:h-127 pr-2">
            {items.length === 0 ? (
              <div className="h-90 lg:h-120 flex flex-col items-center justify-center gap-5">
                <p className="text-center text-muted-foreground">
                  Your cart is empty.
                </p>
                <Button
                  className="rounded-full min-w-40 lg:min-w-50 cursor-pointer"
                  onClick={() => router.push("/shop")}
                >
                  Go to Shop
                  <ArrowRight />
                </Button>
              </div>
            ) : (
              <ul className="flex flex-col gap-5 pr-4">
                {items.map((cartItem) => (
                  <li
                    key={`${cartItem.productId}-${cartItem.sizeId}-${cartItem.colorId}`}
                    className="flex flex-col gap-4 lg:gap-6"
                  >
                    <div className="flex gap-4">
                      <div className="relative aspect-square size-25 lg:size-35 bg-[#f0eeed] rounded-xl overflow-hidden">
                        <Image
                          src={cartItem.imageUrl}
                          alt={cartItem.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 768px"
                          className="w-full h-full object-contain aspect-square"
                        />
                      </div>
                      <div className="w-full flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h2 className="font-bold lg:text-xl">
                            {cartItem.name}
                          </h2>
                          <Button
                            size="icon"
                            variant="link"
                            type="button"
                            onClick={() =>
                              removeItem({
                                productId: cartItem.productId,
                                sizeId: cartItem.sizeId,
                                colorId: cartItem.colorId,
                              })
                            }
                            className="cursor-pointer [&_svg:not([class*='size-'])]:size-6 text-destructive hover:text-destructive/80"
                            title="Delete product"
                            aria-label="Delete product from cart"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                        <p>
                          Size:&nbsp;
                          <span className="text-muted-foreground capitalize">
                            {cartItem.size}
                          </span>
                        </p>
                        <p>
                          Color:&nbsp;
                          <span className="text-muted-foreground capitalize">
                            {cartItem.color}
                          </span>
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <strong
                              className={cn(
                                "text-xl lg:text-2xl font-bold",
                                cartItem.discount > 0
                                  ? "text-destructive"
                                  : "text-primary"
                              )}
                            >
                              {formatCurrency(cartItem.discountedPrice)}
                            </strong>
                            {cartItem.discount > 0 && (
                              <span className="text-xl lg:text-2xl text-muted-foreground font-bold line-through">
                                {formatCurrency(cartItem.price)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-5 rounded-full bg-[#f0f0f0] px-5 py-3 text-sm font-bold">
                            <Button
                              type="button"
                              variant="link"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() =>
                                decrease({
                                  productId: cartItem.productId,
                                  sizeId: cartItem.sizeId,
                                  colorId: cartItem.colorId,
                                })
                              }
                              disabled={cartItem.quantity <= 1}
                            >
                              <Minus />
                            </Button>
                            <span>{cartItem.quantity}</span>
                            <Button
                              type="button"
                              variant="link"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() => increase(cartItem)}
                              disabled={
                                cartItem.quantity >= cartItem.countInStock
                              }
                            >
                              <Plus />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="font-secondary text-xl lg:text-2xl">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6 font-secondary">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Discount</p>
            <strong className="text-destructive">
              -{formatCurrency(totalDiscountAmount)}
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Delivery Fee</p>
            {items.length === 0 ? (
              <span>{formatCurrency(0)}</span>
            ) : isFreeDelivery ? (
              <span className="text-green-600">Free</span>
            ) : (
              <strong>{formatCurrency(DELIVERY_FEE)}</strong>
            )}
          </div>

          {items.length > 0 && !isFreeDelivery && (
            <p className="text-sm text-muted-foreground italic">
              Add {formatCurrency(100 - subtotal)} more to get free delivery!
            </p>
          )}
          <Separator />
          <div className="flex items-center justify-between">
            <strong>Total</strong>
            <strong className="text-xl">{formatCurrency(total)}</strong>
          </div>
          <div className="relative flex items-center gap-3">
            <Input
              className="rounded-full bg-[#f0f0f0] pl-12"
              placeholder="Add promo code"
              // TODO: apply promo code logic
            />
            <Tag className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" />
            <Button className="rounded-full min-w-22 lg:min-w-30 cursor-pointer">
              Apply
            </Button>
          </div>
          <Button
            className="mt-5 w-full rounded-full cursor-pointer"
            onClick={() => router.push("/checkout")}
          >
            Go to Checkout
            <ArrowRight />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
