import { DataTable } from "@/app/(admin)/reviews/data-table";
import { columns, Review } from "@/app/(admin)/reviews/columns";

import { prisma } from "@/prisma/prisma";

const AdminReviewsPage = async () => {
  const data = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      comment: true,
      rating: true,
      isVerifiedPurchase: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
      product: {
        select: { name: true, slug: true },
      },
    },
  });

  return (
    <div className="px-2 flex flex-1 justify-center">
      <DataTable columns={columns} data={data as Review[]} />
    </div>
  );
};

export default AdminReviewsPage;
