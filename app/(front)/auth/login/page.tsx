import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: true,
  },
};

const LoginPage = () => {
  return (
    <section className="py-5 lg:py-10 w-full h-full flex items-center justify-center">
      <LoginForm />
    </section>
  );
};

export default LoginPage;
