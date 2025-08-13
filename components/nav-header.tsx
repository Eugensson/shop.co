"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/constants";

export const NavHeader = () => {
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex items-center gap-6">
      {NAV_LINKS.map(({ label, href }) => (
        <li key={href}>
          <Link
            href={href}
            className={cn(
              "capitalize flex items-center gap-1 text-lg hover:underline hover:underline-offset-5",
              pathname === href && "underline underline-offset-5"
            )}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
