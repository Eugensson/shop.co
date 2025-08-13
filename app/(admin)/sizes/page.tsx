import { columns } from "@/app/(admin)/sizes/columns";
import { DataTable } from "@/app/(admin)/sizes/data-table";

import { prisma } from "@/prisma/prisma";

const AdminSizesPage = async () => {
  const data = await prisma.size.findMany();

  return (
    <div className="container mx-auto py-10 px-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AdminSizesPage;
