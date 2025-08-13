import { notFound } from "next/navigation";

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

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { slug } = await params;

  const productMeta = await getProductBySlug(slug);

  if (!productMeta) {
    notFound();
  }

  const relatedProducts = await getReletedProducts(productMeta);

  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-0 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <AddToHistory id={productMeta.id} category={productMeta.category.name} />
      <Nav segments={[{ label: "Shop", href: "" }]} />
      <ProductPageClient product={productMeta} />
      <Separator />
      <RaleatedProducts items={relatedProducts} />
      <Separator />
      <BrowsingHistory />
    </section>
  );
};

export default ProductDetailsPage;
