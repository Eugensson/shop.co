import type { Metadata } from "next";

import { EditOrderForm } from "@/components/admin/edit-order-form";

import { prisma } from "@/prisma/prisma";
import { OrderWithRelations } from "@/types";

export const metadata: Metadata = {
  title: "Edit order",
  robots: {
    index: false,
    follow: true,
  },
};

interface EditOrderAdminPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

const EditOrderAdminPage = async ({ params }: EditOrderAdminPageProps) => {
  const id = (await params).orderId;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: true,
      deliveryAddress: true,
    },
  });

  if (!order) {
    return <p>Не вдалося знайти замовлення за № {id}</p>;
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <EditOrderForm order={order as OrderWithRelations} />
    </div>
  );
};

export default EditOrderAdminPage;
