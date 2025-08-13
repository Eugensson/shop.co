"use client";

import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useWishlistService } from "@/hooks/use-wishlist-service";

export const WishlistInfo = () => {
  const { wishlistProductIds } = useWishlistService();

  const displayCount =
    wishlistProductIds.length > 9 ? "9+" : wishlistProductIds.length;

  const ariaLabel =
    wishlistProductIds.length > 0
      ? `You have ${displayCount} product${
          wishlistProductIds.length === 1 ? "" : "s"
        } in your wishlist`
      : "Your wishlist is empty";

  return (
    <div className="relative">
      <Heart
        size={24}
        className="cursor-pointer hover:text-destructive transition-colors"
        aria-hidden="true"
      />
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {ariaLabel}
      </span>
      <Badge
        variant="destructive"
        className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
        aria-label={ariaLabel}
      >
        {displayCount}
      </Badge>
    </div>
  );
};
