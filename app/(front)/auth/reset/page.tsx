import type { Metadata } from "next";

import { ResetForm } from "@/components/auth/reset-form";

export const metadata: Metadata = {
  title: "Reset password",
  robots: {
    index: false,
    follow: true,
  },
};

const ResetPage = () => {
  return (
    <div className="w-full min-h-[65vh] flex items-center justify-center">
      <ResetForm />
    </div>
  );
};

export default ResetPage;
