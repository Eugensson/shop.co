import { EditProductForm } from "@/components/admin/edit-product-form";

import { prisma } from "@/prisma/prisma";

interface ProductInfoPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const EditProductPage = async ({ params }: ProductInfoPageProps) => {
  const id = (await params).productId;

  const [product, brands, categories, colors, sizes] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { brand: true, category: true, images: true, variants: true },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
    prisma.size.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    return <p>Product with {id} not found</p>;
  }

  return (
    <div className="container min-h-[95vh] mx-auto py-10 px-2 flex flex-col items-center justify-center">
      <EditProductForm
        product={product}
        brands={brands}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />
    </div>
  );
};

export default EditProductPage;
