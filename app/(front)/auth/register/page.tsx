import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  robots: {
    index: false,
    follow: true,
  },
};

const RegisterPage = () => {
  return (
    <section className="py-5 lg:py-10 w-full h-full flex items-center justify-center">
      <RegisterForm />
    </section>
  );
};

export default RegisterPage;
