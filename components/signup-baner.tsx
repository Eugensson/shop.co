import Link from "next/link";

export const SignupBaner = () => {
  return (
    <section className="bg-black text-white py-2 text-center font-secondary">
      <p className="text-xs lg:text-sm">
        Sign up and get 20% off to your first order.&nbsp;&nbsp;
        <Link
          href="/auth/register"
          className="text-inherit hover:underline hover:underline-offset-4"
        >
          Sign up now
        </Link>
      </p>
    </section>
  );
};
