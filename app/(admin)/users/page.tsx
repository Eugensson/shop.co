import type { Metadata } from "next";

import { DataTable } from "@/app/(admin)/users/data-table";
import { columns, User } from "@/app/(admin)/users/columns";

import { prisma } from "@/prisma/prisma";

export const metadata: Metadata = {
  title: "Users",
  robots: {
    index: false,
    follow: true,
  },
};

const AdminCustomersPage = async () => {
  const data = await prisma.user.findMany();

  return (
    <div className="px-2 flex flex-1 justify-center">
      <DataTable columns={columns} data={data as User[]} />
    </div>
  );
};

export default AdminCustomersPage;
