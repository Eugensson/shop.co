import CreateProductForm from "@/components/admin/create-product-form";

import { prisma } from "@/prisma/prisma";

const CreateProductPage = async () => {
  const [brands, categories, colors, sizes] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
    prisma.size.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex items-center justify-center min-h-[95vh]">
      <CreateProductForm
        brands={brands}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />
    </div>
  );
};

export default CreateProductPage;
