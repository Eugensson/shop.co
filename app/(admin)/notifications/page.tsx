import type { Metadata } from "next";

import { DataTable } from "@/app/(admin)/notifications/data-table";
import { columns, Notification } from "@/app/(admin)/notifications/columns";

import { prisma } from "@/prisma/prisma";

export const metadata: Metadata = {
  title: "Notifications",
  robots: {
    index: false,
    follow: true,
  },
};

const NotificationsPage = async () => {
  const data = await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-2 flex flex-1 justify-center">
      <DataTable columns={columns} data={data as Notification[]} />
    </div>
  );
};

export default NotificationsPage;
