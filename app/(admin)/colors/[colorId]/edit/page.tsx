import { EditColorForm } from "@/components/admin/edit-color-form";

import { prisma } from "@/prisma/prisma";

interface EditColorPageProps {
  params: Promise<{
    colorId: string;
  }>;
}

const EditColorPage = async ({ params }: EditColorPageProps) => {
  const id = (await params).colorId;

  const color = await prisma.color.findUnique({
    where: { id },
  });

  if (!color) {
    return <p>Color with {id} not found</p>;
  }

  return (
    <div className="flex items-center justify-center h-[95vh]">
      <EditColorForm color={color} />
    </div>
  );
};

export default EditColorPage;
