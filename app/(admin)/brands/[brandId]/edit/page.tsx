import type { Metadata } from "next";

import { EditBrandForm } from "@/components/admin/edit-brand-form";

import { prisma } from "@/prisma/prisma";

export const metadata: Metadata = {
  title: "Edit brand",
  robots: {
    index: false,
    follow: true,
  },
};

interface EditBrandPageProps {
  params: Promise<{
    brandId: string;
  }>;
}

const EditBrandPage = async ({ params }: EditBrandPageProps) => {
  const id = (await params).brandId;

  const brand = await prisma.brand.findUnique({ where: { id } });

  if (!brand) {
    return <p>Brand with {id} not found</p>;
  }

  return (
    <div className="flex items-center justify-center h-[95vh]">
      <EditBrandForm brand={brand} />
    </div>
  );
};

export default EditBrandPage;
