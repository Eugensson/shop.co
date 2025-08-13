import { columns } from "@/app/(admin)/brands/columns";
import { DataTable } from "@/app/(admin)/brands/data-table";

import { prisma } from "@/prisma/prisma";

const AdminBrandsPage = async () => {
  const data = await prisma.brand.findMany();

  return (
    <div className="container mx-auto py-10 px-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AdminBrandsPage;
