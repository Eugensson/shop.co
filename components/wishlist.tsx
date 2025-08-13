"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";

import { ProductWithRelations } from "@/types";
import { getWishlistProducts } from "@/actions/product.actions";
import { useWishlistService } from "@/hooks/use-wishlist-service";

export const Wishlist = () => {
  const router = useRouter();
  const { wishlistProductIds } = useWishlistService();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<ProductWithRelations[]>([]);

  const ids = useMemo(() => wishlistProductIds, [wishlistProductIds]);

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      return;
    }

    startTransition(() => {
      getWishlistProducts(ids).then((data) => {
        if ("error" in data) {
          setProducts([]);
          console.error(data.error);
        } else {
          setProducts(data);
        }
      });
    });
  }, [ids]);

  if (isPending && !products.length) return <WishlistSkeleton />;

  return (
    <div className="container">
      {products.length > 0 ? (
        <div className="p-5 lg:py-10 space-y-10">
          <h2 className="text-3xl lg:text-5xl text-center uppercase font-black tracking-tight font-secondary">
            Your wishlist
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard item={product} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-5">
          <div className="flex flex-col items-center justify-center gap-10">
            <h2 className="font-semibold text-xl">Your Wishlist is empty.</h2>
            <Button
              className="rounded-full min-w-40 lg:min-w-50 cursor-pointer"
              onClick={() => router.push("/shop")}
            >
              Browse Products
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const WishlistSkeleton = () => {
  return (
    <div className="container">
      <div className="p-5 lg:py-10 space-y-10">
        <h2 className="text-3xl lg:text-5xl text-center uppercase font-black tracking-tight font-secondary">
          Your wishlist
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <li key={idx}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
