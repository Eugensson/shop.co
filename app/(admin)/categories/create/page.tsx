import type { Metadata } from "next";

import { CreateCategoryForm } from "@/components/admin/create-category-form";

export const metadata: Metadata = {
  title: "Create category",
  robots: {
    index: false,
    follow: true,
  },
};

const CreateCategoryPage = () => {
  return (
    <div className="flex items-center justify-center h-[95vh]">
      <CreateCategoryForm />
    </div>
  );
};

export default CreateCategoryPage;
