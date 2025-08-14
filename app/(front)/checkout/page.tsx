import type { Metadata } from "next";

import { Nav } from "@/components/nav";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: {
    index: false,
    follow: true,
  },
};

const CheckoutPage = () => {
  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-12 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <Nav segments={[{ label: "Checkout", href: "" }]} />
      <div className="min-h-[45vh] flex items-center justify-center">
        <CheckoutForm />
      </div>
    </section>
  );
};

export default CheckoutPage;
