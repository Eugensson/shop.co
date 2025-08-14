import type { Metadata } from "next";

import { DataTable } from "@/app/(admin)/orders/data-table";
import { columns, Order } from "@/app/(admin)/orders/columns";

import { prisma } from "@/prisma/prisma";

export const metadata: Metadata = {
  title: "Orders",
  robots: {
    index: false,
    follow: true,
  },
};

const AdminOrdersPage = async () => {
  const data = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },

    include: {
      user: { select: { name: true } },
    },
  });

  return (
    <div className="px-2 flex flex-1 justify-center">
      <DataTable columns={columns} data={data as Order[]} />
    </div>
  );
};

export default AdminOrdersPage;
