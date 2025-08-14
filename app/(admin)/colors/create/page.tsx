import type { Metadata } from "next";

import { CreateColorForm } from "@/components/admin/create-color-form";

export const metadata: Metadata = {
  title: "Create color",
  robots: {
    index: false,
    follow: true,
  },
};

const CreateColorPage = () => {
  return (
    <div className="flex items-center justify-center h-[95vh]">
      <CreateColorForm />
    </div>
  );
};

export default CreateColorPage;
