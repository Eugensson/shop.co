import { cache } from "react";
import { format } from "date-fns";
import type { Metadata } from "next";

import NotFound from "@/app/not-found";
import { Nav } from "@/components/nav";
import { Separator } from "@/components/ui/separator";
import { AddToHistory } from "@/components/add-to-history";
import { BrowsingHistory } from "@/components/browsing-history";
import { RaleatedProducts } from "@/components/related-products";
import { ProductPageClient } from "@/components/product-page-client";

import {
  getProductBySlug,
  getReletedProducts,
} from "@/actions/product.actions";

export const revalidate = 300;

const getProductCached = cache(async (slug: string) => {
  const product = await getProductBySlug(slug);

  if (!product) return null;

  const related = await getReletedProducts(product);
  return { product, related };
});

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const data = await getProductCached(slug);

  if (!data?.product) {
    return {
      title: "Product not found",
      description:
        "Unfortunately, this product does not exist or has been removed.",
    };
  }

  const { product } = data;

  return {
    title: `${product.name}`,
    description: `Description "${product.description}". Update at: ${format(
      product.updatedAt,
      "dd MMMM yyyy"
    )}`,
  };
};

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { slug } = await params;

  const data = await getProductCached(slug);

  if (!data?.product) {
    return <NotFound />;
  }

  const { product, related } = data;

  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-0 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <AddToHistory id={product.id} category={product.category.name} />
      <Nav segments={[{ label: "Shop", href: "" }]} />
      <ProductPageClient product={product} />
      <Separator />
      <RaleatedProducts items={related} />
      <Separator />
      <BrowsingHistory />
    </section>
  );
};

export default ProductDetailsPage;
