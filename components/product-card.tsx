"use client";

import Link from "next/link";
import Image from "next/image";

import { Rating } from "@/components/rating";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleWishlistBtn } from "@/components/toggle-wishlist-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProductWithRelations } from "@/types";

interface ProductCardProps {
  item: ProductWithRelations;
  href?: string;
}

export const ProductCard = ({
  item,
  href = `/product/${item.slug}`,
}: ProductCardProps) => {
  const mainImage = item.images.find((img) => img.isMain) ?? item.images[0];

  return (
    <Card className="rounded-none border-none shadow-none">
      <CardContent className="bg-[#f2f0f1] p-4 relative w-full h-74 rounded-2xl overflow-hidden group">
        <Link href={href}>
          <Image
            fill
            src={mainImage?.url ?? "/placeholder.jpg"}
            alt={item.name}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-full object-contain object-center"
          />
        </Link>
        <ToggleWishlistBtn productId={item.id} />
      </CardContent>
      <CardHeader>
        <Link href={`/product/${item.slug}`}>
          <CardTitle className="min-h-14 text-base lg:text-lg font-bold capitalize line-clamp-2">
            {item.name}
          </CardTitle>
        </Link>
        <Rating avgRating={item.avgRating} />
        {item.variants[0].price !== item.variants[0].discountedPrice ? (
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">
              ${item.variants[0].discountedPrice}
            </p>
            <p className="text-2xl line-through text-muted-foreground">
              ${item.variants[0].price}
            </p>
            <Badge className="text-destructive bg-destructive/10 rounded-full font-bold">
              -{item.variants[0].discount}%
            </Badge>
          </div>
        ) : (
          <p className="text-2xl font-bold">${item.variants[0].price}</p>
        )}
      </CardHeader>
    </Card>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <Card className="rounded-none border-none shadow-none">
      <CardContent className="bg-[#f2f0f1] p-4 relative w-full h-74 rounded-2xl overflow-hidden">
        <Skeleton className="w-full h-full rounded-2xl" />
      </CardContent>
      <CardHeader className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
      </CardHeader>
    </Card>
  );
};
