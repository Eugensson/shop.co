"use client";

import { Check, Minus, Plus } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AddToCartBtn } from "@/components/add-to-cart-btn";
import { RatingSummary } from "@/components/rating-summary";

import { cn } from "@/lib/utils";
import { CartItem, ProductForUI } from "@/types";

interface ProductInfoProps {
  product: ProductForUI;
  onViewAllReviewsClick?: () => void;
}

export const ProductInfo = ({
  product,
  onViewAllReviewsClick,
}: ProductInfoProps) => {
  const availableVariants = useMemo(
    () => product.variants.filter((v) => v.quantity > 0),
    [product.variants]
  );

  const firstVariant = availableVariants[0];
  const [selectedSize, setSelectedSize] = useState(firstVariant.size);
  const [selectedColor, setSelectedColor] = useState(firstVariant.color);

  const activeVariant = useMemo(
    () =>
      availableVariants.find(
        (v) => v.color.id === selectedColor.id && v.size.id === selectedSize.id
      ),
    [availableVariants, selectedColor, selectedSize]
  );

  const allColors = useMemo(() => {
    const map = new Map();
    availableVariants.forEach((v) => {
      if (!map.has(v.color.id)) map.set(v.color.id, v.color);
    });
    return Array.from(map.values());
  }, [availableVariants]);

  const allSizes = useMemo(() => {
    const map = new Map();
    availableVariants.forEach((v) => {
      if (!map.has(v.size.id)) map.set(v.size.id, v.size);
    });
    return Array.from(map.values());
  }, [availableVariants]);

  const disabledSizeIds = useMemo(() => {
    const enabledSizes = new Set(
      availableVariants
        .filter((v) => v.color.id === selectedColor.id)
        .map((v) => v.size.id)
    );
    return allSizes.filter((s) => !enabledSizes.has(s.id)).map((s) => s.id);
  }, [availableVariants, selectedColor, allSizes]);

  useEffect(() => {
    if (disabledSizeIds.includes(selectedSize.id)) {
      const firstAvailable = allSizes.find(
        (s) => !disabledSizeIds.includes(s.id)
      );
      if (firstAvailable) setSelectedSize(firstAvailable);
    }
  }, [allSizes, disabledSizeIds, selectedSize.id]);

  const [item, setItem] = useState<CartItem>({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    quantity: 1,
    price: firstVariant.price,
    discountedPrice: firstVariant.discountedPrice ?? firstVariant.price,
    discount: firstVariant.discount,
    countInStock: firstVariant.quantity,
    size: firstVariant.size.name,
    sizeId: firstVariant.size.id,
    color: firstVariant.color.name,
    colorId: firstVariant.color.id,
    imageUrl: product.images[0]?.url ?? "",
  });

  useEffect(() => {
    if (!activeVariant) return;
    setItem((prev) => ({
      ...prev,
      size: selectedSize.name,
      sizeId: selectedSize.id,
      color: selectedColor.name,
      colorId: selectedColor.id,
      price: activeVariant.price,
      discountedPrice: activeVariant.discountedPrice ?? activeVariant.price,
      discount: activeVariant.discount,
      countInStock: activeVariant.quantity,
      quantity: 1,
    }));
  }, [activeVariant, selectedColor, selectedSize]);

  return (
    <div className="flex flex-col gap-1">
      <h2 className="mb-3 lg:mb-4 max-w-[65vw] lg:max-w-full text-2xl lg:text-3xl xl:text-4xl font-black font-secondary uppercase">
        {product.name}
      </h2>

      <RatingSummary
        avgRating={product.avgRating}
        numReviews={product.countReviews}
        asPopover
        ratingDistribution={
          product.ratingDistribution as [{ rating: number; count: number }]
        }
        onViewAllReviewsClick={onViewAllReviewsClick}
      />

      {activeVariant?.price !== activeVariant?.discountedPrice ? (
        <div className="mb-5 flex items-center gap-2">
          <p className="text-2xl lg:text-4xl font-bold">
            ${activeVariant?.discountedPrice.toFixed(2)}
          </p>
          <p className="text-2xl lg:text-4xl line-through text-muted-foreground">
            ${activeVariant?.price.toFixed(2)}
          </p>
          <Badge className="text-destructive bg-destructive/10 rounded-full font-bold text-sm lg:text-base">
            -{activeVariant?.discount}%
          </Badge>
        </div>
      ) : (
        <p className="mb-5 text-2xl lg:text-4xl font-bold">
          ${activeVariant?.price.toFixed(2)}
        </p>
      )}

      <div
        className="lg:max-w-150 text-sm lg:text-base text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />

      <Separator className="my-6" />

      <p className="mb-4 text-sm lg:text-base text-muted-foreground capitalize">
        Select color
      </p>
      <ul className="flex flex-wrap items-center gap-4">
        {allColors.map((color) => (
          <li
            key={color.id}
            aria-label={color.name}
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: color.hex }}
            className={cn(
              "flex items-center justify-center cursor-pointer size-9 rounded-full border-2",
              selectedColor.id === color.id
                ? "border-black"
                : "border-transparent"
            )}
          >
            <Check
              className={cn(
                "w-4 h-4",
                selectedColor.id === color.id
                  ? color.hex === "#ffffff"
                    ? "text-black"
                    : "text-white"
                  : "opacity-0"
              )}
            />
          </li>
        ))}
      </ul>

      <Separator className="my-6" />

      <p className="mb-4 text-sm lg:text-base text-muted-foreground capitalize">
        Choose size
      </p>
      <ul className="flex flex-wrap items-center gap-2 lg:gap-4">
        {allSizes.map((size) => {
          const isDisabled = disabledSizeIds.includes(size.id);
          return (
            <li
              key={size.id}
              className={cn(
                "min-w-25 flex items-center justify-center px-4.5 py-2.5 rounded-full border text-sm bg-[#f0f0f0]",
                selectedSize.id === size.id &&
                  !isDisabled &&
                  "bg-black text-white",
                isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              )}
              onClick={() => !isDisabled && setSelectedSize(size)}
            >
              {size.name}
            </li>
          );
        })}
      </ul>

      <Separator className="my-6" />

      <div className="flex items-center gap-5 lg:gap-10">
        <div className="flex items-center gap-5 rounded-full bg-[#f0f0f0] px-5 py-3 text-sm font-bold">
          <Button
            type="button"
            variant="link"
            size="icon"
            className="cursor-pointer"
            onClick={() =>
              setItem((prev) => ({
                ...prev,
                quantity: Math.max(prev.quantity - 1, 1),
              }))
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
            onClick={() =>
              setItem((prev) => ({
                ...prev,
                quantity: Math.min(prev.quantity + 1, item.countInStock),
              }))
            }
            disabled={item.quantity >= item.countInStock}
          >
            <Plus />
          </Button>
        </div>
        <AddToCartBtn item={item} />
      </div>
    </div>
  );
};
