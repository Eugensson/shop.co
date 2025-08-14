import type { Metadata } from "next";

import { columns } from "@/app/(admin)/colors/columns";
import { DataTable } from "@/app/(admin)/colors/data-table";

import { prisma } from "@/prisma/prisma";

export const metadata: Metadata = {
  title: "Colors",
  robots: {
    index: false,
    follow: true,
  },
};

const AdminColorsPage = async () => {
  const data = await prisma.color.findMany();

  return (
    <div className="container mx-auto py-10 px-2">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AdminColorsPage;
