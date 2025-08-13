import { columns } from "@/app/(admin)/categories/columns";
import { DataTable } from "@/app/(admin)/categories/data-table";

import { prisma } from "@/prisma/prisma";

const AdminCategoriesPage = async () => {
  const data = await prisma.category.findMany();

  return (
    <div className="container mx-auto py-10 px-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AdminCategoriesPage;
