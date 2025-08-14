import type { Metadata } from "next";

import { EditSizeForm } from "@/components/admin/edit-size-form";

import { prisma } from "@/prisma/prisma";

export const metadata: Metadata = {
  title: "Edit size",
  robots: {
    index: false,
    follow: true,
  },
};

interface EditSizePageProps {
  params: Promise<{
    sizeId: string;
  }>;
}

const EditSizePage = async ({ params }: EditSizePageProps) => {
  const id = (await params).sizeId;

  const size = await prisma.size.findUnique({ where: { id } });

  if (!size) {
    return <p>Size with {id} not found</p>;
  }

  return (
    <div className="flex items-center justify-center h-[95vh]">
      <EditSizeForm size={size} />
    </div>
  );
};

export default EditSizePage;
