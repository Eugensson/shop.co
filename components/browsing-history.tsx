"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";

import { ProductWithRelations } from "@/types";
import { getViewedProducts } from "@/actions/product.actions";
import { useBrowsingHistory } from "@/hooks/use-browsing-history";

export const BrowsingHistory = () => {
  const [isPending, startTransition] = useTransition();
  const { products: historyItems } = useBrowsingHistory();
  const [products, setProducts] = useState<ProductWithRelations[]>([]);

  const ids = useMemo(() => {
    const ids = historyItems.map((item) => item.id);
    return ids;
  }, [historyItems]);

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      return;
    }

    startTransition(() => {
      getViewedProducts(ids).then((data) => {
        if ("error" in data) {
          setProducts([]);
          console.error(data.error);
        } else {
          setProducts(data as ProductWithRelations[]);
        }
      });
    });
  }, [ids]);

  if (isPending) return <div>Loading...</div>;

  return (
    <>
      {products.length > 0 && (
        <section className="pt-13 lg:pt-20">
          <Carousel
            opts={{
              align: "start",
            }}
            className="relative w-full container mx-auto max-w-310 pt-20"
          >
            <h2 className="max-w-[60vw] lg:max-w-none absolute top-0 left-0 text-3xl lg:text-5xl text-left uppercase font-black tracking-tight font-secondary">
              your browsing history
            </h2>
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="p-1">
                    <ProductCard item={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="top-14 lg:top-10 right-8 [&_svg:not([class*='size-'])]:size-6 font-black" />
            <CarouselNext className="top-14 lg:top-10 right-0 [&_svg:not([class*='size-'])]:size-6 font-black" />
          </Carousel>
        </section>
      )}
    </>
  );
};
