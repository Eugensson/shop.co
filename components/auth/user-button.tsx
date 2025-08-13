"use client";

import {
  CircleUserRound,
  FolderClock,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { signIn, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentRole } from "@/hooks/use-current-role";

export const UserButton = ({ className }: { className?: string }) => {
  const user = useCurrentUser();
  const role = useCurrentRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={user ? "User menu" : "Sign in / Sign up"}
        title={user ? "User menu" : "Sign in / Sign up"}
        className={cn(
          buttonVariants({ variant: "link", size: "icon" }),
          "cursor-pointer outline-none [&_svg:not([class*='size-'])]:size-6.5 hover:text-destructive transition-colors",
          className
        )}
      >
        <CircleUserRound aria-hidden="true" />
        <span className="sr-only">
          {user ? "User menu" : "Sign in or Sign up"}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-50" align="end" aria-label="User menu">
        {user ? (
          <>
            <DropdownMenuLabel>
              {user?.name || user?.email || "Incognito"}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex items-center"
                aria-label="Перейти до профілю"
              >
                <UserIcon className="mr-2 size-4" aria-hidden="true" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {role === UserRole.ADMIN && (
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center"
                  aria-label="Go to admin panel"
                >
                  <LayoutDashboard className="mr-2 size-4" aria-hidden="true" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}

            {role === UserRole.USER && (
              <DropdownMenuItem asChild>
                <Link
                  href="/profile/order-history"
                  className="flex items-center"
                  aria-label="Go to order history"
                >
                  <FolderClock className="mr-2 size-4" aria-hidden="true" />
                  Order history
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer flex items-center"
              onClick={() => signOut({ callbackUrl: "/" })}
              role="button"
              tabIndex={0}
              aria-label="Logout"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  signOut({ callbackUrl: "/" });
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer flex items-center"
            onClick={() => signIn()}
            role="button"
            tabIndex={0}
            aria-label="Sign in"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") signIn();
            }}
          >
            <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
            Sign in
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
