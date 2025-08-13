import { columns } from "@/app/(admin)/products/columns";
import { DataTable } from "@/app/(admin)/products/data-table";

import { prisma } from "@/prisma/prisma";

const AdminProductsPage = async () => {
  const data = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true },
      },
      brand: {
        select: { name: true },
      },
      variants: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10 px-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AdminProductsPage;
