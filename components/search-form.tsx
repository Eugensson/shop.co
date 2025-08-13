"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

export const SearchForm = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative", className)}>
      <Input
        placeholder="Search for products..."
        className="rounded-full pl-12"
      />
      <Search
        size={24}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
};
