import type { Metadata } from "next";

import { Nav } from "@/components/nav";
import { Wishlist } from "@/components/wishlist";

export const metadata: Metadata = {
  title: "Your wishlist",
  robots: {
    index: false,
    follow: true,
  },
};

const WishlistPage = () => {
  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-12 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <Nav segments={[{ label: "Wishlist", href: "" }]} />
      <div className="min-h-[50vh] flex justify-center items-center">
        <Wishlist />
      </div>
    </section>
  );
};

export default WishlistPage;
