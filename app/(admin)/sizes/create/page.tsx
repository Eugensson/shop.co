import type { Metadata } from "next";

import { CreateSizeForm } from "@/components/admin/create-size-form";

export const metadata: Metadata = {
  title: "Create size",
  robots: {
    index: false,
    follow: true,
  },
};

const CreateSizePage = () => {
  return (
    <div className="flex items-center justify-center h-[95vh]">
      <CreateSizeForm />
    </div>
  );
};

export default CreateSizePage;
