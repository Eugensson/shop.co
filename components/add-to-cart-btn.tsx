"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { CartItem } from "@/types";
import { useCartService } from "@/hooks/use-cart-store";

interface AddToCartBtnProps {
  item: CartItem;
  disabled?: boolean;
}

export const AddToCartBtn = ({ item, disabled }: AddToCartBtnProps) => {
  const router = useRouter();
  const { items, addToCart } = useCartService();

  const isInCart = items.some(
    (i) =>
      i.productId === item.productId &&
      i.sizeId === item.sizeId &&
      i.colorId === item.colorId
  );

  const addToCartHandler = () => {
    if (item.countInStock === 0) {
      toast("This product is temporarily unavailable.");
      return;
    }

    addToCart(item);

    toast.success("Product added to cart");

    router.push("/shop");
  };

  return (
    <Button
      type="button"
      size="lg"
      className="flex-1 rounded-full cursor-pointer lg:max-w-70"
      onClick={addToCartHandler}
      disabled={disabled || isInCart}
    >
      {isInCart ? "Added to cart" : "Add to cart"}
    </Button>
  );
};
