import { EditCategoryForm } from "@/components/admin/edit-category-form";

import { prisma } from "@/prisma/prisma";

interface EditCategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const EditCategoryPage = async ({ params }: EditCategoryPageProps) => {
  const id = (await params).categoryId;

  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    return <p>Category with {id} not found</p>;
  }

  return (
    <div className="flex items-center justify-center h-[95vh]">
      <EditCategoryForm category={category} />
    </div>
  );
};

export default EditCategoryPage;
