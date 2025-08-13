"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = () => {
    signIn("google", {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={onClick}
      title="Continue with Google"
      aria-label="Continue with Google"
      className="w-full cursor-pointer"
    >
      <FcGoogle size={20} /> Continue with Google
    </Button>
  );
};
