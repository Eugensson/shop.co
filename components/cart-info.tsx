"use client";

import { useMemo } from "react";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useCartService } from "@/hooks/use-cart-store";

export const CartInfo = () => {
  const { items } = useCartService();

  const totalItems = useMemo(
    () => items.reduce((a, c) => a + c.quantity, 0),
    [items]
  );

  return (
    <div className="relative">
      <ShoppingCart
        size={24}
        aria-label="Shopping cart"
        className="cursor-pointer hover:text-destructive transition-colors"
      />
      <Badge
        variant="destructive"
        aria-label={
          totalItems > 0
            ? `Your cart has ${totalItems} items`
            : "Your cart is empty"
        }
        className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
      >
        {totalItems}
      </Badge>
    </div>
  );
};
