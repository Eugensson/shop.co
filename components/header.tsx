import Link from "next/link";
import { AlignJustify, Search } from "lucide-react";

import { Logo } from "@/components/logo";
import { CartInfo } from "@/components/cart-info";
import { NavHeader } from "@/components/nav-header";
import { SearchForm } from "@/components/search-form";
import { WishlistInfo } from "@/components/wishlist-info";
import { UserButton } from "@/components/auth/user-button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="px-4 xl:px-0">
        <nav className="py-5 container mx-auto max-w-310 flex items-center justify-between lg:gap-10 border-b">
          <div className="flex items-center gap-4">
            <AlignJustify size={24} className="lg:hidden" />
            <Logo className="hidden sm:block" />
          </div>
          <NavHeader />
          <SearchForm className="hidden lg:flex flex-1 bg-accent rounded-full" />
          <div className="flex items-center gap-3">
            <Search size={24} className="lg:hidden" />
            <Link href="/cart">
              <CartInfo />
            </Link>
            <Link href="/wishlist">
              <WishlistInfo />
            </Link>
            <UserButton />
          </div>
        </nav>
      </div>
    </header>
  );
};
