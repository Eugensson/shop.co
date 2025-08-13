"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWishlistService } from "@/hooks/use-wishlist-service";

type ToggleWishlistBtnProps = {
  productId: string;
};

export const ToggleWishlistBtn = ({ productId }: ToggleWishlistBtnProps) => {
  const { wishlistProductIds, addToWishlist, removeFromWishlist } =
    useWishlistService();

  const isWishlist = wishlistProductIds.includes(productId);

  const label = isWishlist ? "Remove from wishlist" : "Add to wishlist";

  const areaLabel = isWishlist
    ? "Remove product from wishlist"
    : "Add product to wishlist";

  const handleClick = () =>
    isWishlist ? removeFromWishlist(productId) : addToWishlist(productId);

  return (
    <Button
      onClick={handleClick}
      size="icon"
      variant={isWishlist ? "default" : "outline"}
      aria-label={areaLabel}
      title={label}
      className="hidden group-hover:flex absolute top-4 right-4 cursor-pointer z-10 [&_svg:not([class*='size-'])]:size-5"
    >
      <Heart className={isWishlist ? "fill-white" : ""} />
    </Button>
  );
};
