import Link from "next/link";

import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        "font-secondary uppercase font-black text-2xl lg:text-3xl",
        className
      )}
    >
      shop.co
    </Link>
  );
};
