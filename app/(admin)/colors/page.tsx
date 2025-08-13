import { columns } from "@/app/(admin)/colors/columns";
import { DataTable } from "@/app/(admin)/colors/data-table";

import { prisma } from "@/prisma/prisma";

const AdminColorsPage = async () => {
  const data = await prisma.color.findMany();

  return (
    <div className="container mx-auto py-10 px-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AdminColorsPage;
