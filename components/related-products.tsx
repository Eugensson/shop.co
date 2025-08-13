import { Prisma } from "@prisma/client";

import { ProductCard } from "@/components/product-card";

interface RaleatedProductsProps {
  items: Prisma.ProductGetPayload<{
    include: {
      category: true;
      brand: true;
      variants: true;
      images: true;
    };
  }>[];
}

export const RaleatedProducts = ({ items }: RaleatedProductsProps) => {
  return (
    <section className="pt-12 lg:pt-18 container mx-auto max-w-310">
      <h2 className="text-3xl lg:text-5xl text-left uppercase font-black tracking-tight font-secondary mb-10">
        you might also like
      </h2>
      <ul className="mb-6 lg:mb-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <li key={item.slug} className="flex flex-col gap-y-4 lg:gap-y-6">
            <ProductCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
};
