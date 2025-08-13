"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { SORT_ORDERS } from "@/constants";

interface SortBarProps {
  className?: string;
}

export const SortBar = ({ className }: SortBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "most-popular";

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className={cn("items-center gap-1", className)}>
      <span className="text-muted-foreground">Sort by:</span>
      <Select defaultValue={currentSort} onValueChange={onChange}>
        <SelectTrigger className="border-none font-semibold w-42">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_ORDERS.map((sortOrder) => (
            <SelectItem key={sortOrder.value} value={sortOrder.value}>
              {sortOrder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
