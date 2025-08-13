import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";

import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";

interface TopSellingProps {
  items: Prisma.ProductGetPayload<{
    include: {
      category: true;
      brand: true;
      variants: true;
      images: true;
    };
  }>[];
}

export const TopSelling = ({ items }: TopSellingProps) => {
  return (
    <section className="pt-12 lg:pt-18 pb-10 lg:pb-16 container mx-auto max-w-310">
      <h2 className="text-3xl lg:text-5xl text-center uppercase font-black tracking-tight font-secondary">
        top selling
      </h2>
      <ul className="mb-6 lg:mb-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <li key={item.slug} className="flex flex-col gap-y-4 lg:gap-y-6">
            <ProductCard item={item} />
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <Link
          href="/sale"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full md:max-w-55 rounded-full capitalize"
          )}
        >
          View all
        </Link>
      </div>
    </section>
  );
};
