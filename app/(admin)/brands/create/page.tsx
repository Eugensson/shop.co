import type { Metadata } from "next";

import { CreateBrandForm } from "@/components/admin/create-brand-form";

export const metadata: Metadata = {
  title: "Create brand",
  robots: {
    index: false,
    follow: true,
  },
};

const CreateBrandPage = () => {
  return (
    <div className="flex items-center justify-center h-[95vh]">
      <CreateBrandForm />
    </div>
  );
};

export default CreateBrandPage;
