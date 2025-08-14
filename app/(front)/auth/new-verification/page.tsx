import type { Metadata } from "next";

import { NewVerificationForm } from "@/components/auth/new-verification-form";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: {
    index: false,
    follow: true,
  },
};

const NewVerificationPage = () => {
  return (
    <section className="w-full h-[69vh] flex items-center justify-center">
      <NewVerificationForm />
    </section>
  );
};

export default NewVerificationPage;
