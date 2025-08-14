"use client";

import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10">
      <h2 className="flex items-center gap-2 text-3xl leading-normal tracking-tight font-medium text-destructive">
        <SearchX className="size-10" />
        Page not found
      </h2>
      <p className="text-lg text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button onClick={handleBack} size="lg">
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
