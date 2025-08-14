import type { Metadata } from "next";

import { NewPasswordForm } from "@/components/auth/new-password-form";

export const metadata: Metadata = {
  title: "Change password",
  robots: {
    index: false,
    follow: true,
  },
};

const NewPasswordPage = () => {
  return (
    <section className="w-full min-h-[65vh] flex items-center justify-center">
      <NewPasswordForm />
    </section>
  );
};

export default NewPasswordPage;
