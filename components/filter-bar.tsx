"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brand, Category, Color, Size } from "@prisma/client";
import { Check, ChevronRight, SlidersVertical } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { DRESS_STYLE_LIST } from "@/constants";

interface FilterBarProps {
  sizes: Size[];
  colors: Color[];
  brands: Brand[];
  categories: Category[];
  initialFilters?: Partial<FilterState>;
}

const defaultFilters = {
  size: undefined as string | undefined,
  color: undefined as string | undefined,
  dressStyle: undefined as string | undefined,
  priceRange: [0, 250] as [number, number],
  brand: undefined as string | undefined,
  category: undefined as string | undefined,
  gender: undefined as string | undefined,
};

type FilterState = typeof defaultFilters;
type FilterKey = Exclude<keyof FilterState, "priceRange">;

export const FilterBar = ({
  sizes,
  colors,
  brands,
  categories,
  initialFilters = {},
}: FilterBarProps) => {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  const toggleFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (filters.size) params.set("size", filters.size);
    if (filters.color) params.set("color", filters.color);
    if (filters.dressStyle) params.set("dressStyle", filters.dressStyle);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.category) params.set("category", filters.category);
    if (filters.gender) params.set("gender", filters.gender);

    params.set("minPrice", filters.priceRange[0].toString());
    params.set("maxPrice", filters.priceRange[1].toString());

    router.push(`/shop?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    router.push("/shop");
  };

  return (
    <aside className="lg:border-2 lg:rounded-xl lg:pt-5 lg:px-6 lg:pb-7 space-y-6 lg:h-fit">
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm lg:text-xl">Filters</p>
        <SlidersVertical
          size={24}
          className="hidden lg:block text-muted-foreground"
        />
      </div>
      <Separator />

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="font-bold text-sm lg:text-xl">
            Category
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ul className="space-y-5.5 text-muted-foreground">
              {categories.map(({ name, slug }) => (
                <li
                  key={slug}
                  className={cn(
                    "flex items-center justify-between cursor-pointer",
                    filters.category === slug && "font-semibold text-black"
                  )}
                  onClick={() => toggleFilter("category", slug)}
                >
                  <span>{name}</span>
                  <ChevronRight size={16} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="font-bold text-sm lg:text-xl">
            Price
          </AccordionTrigger>
          <AccordionContent className="mt-4 flex flex-col gap-4 text-balance">
            <Slider
              min={0}
              max={250}
              step={1}
              value={filters.priceRange}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: val as [number, number],
                }))
              }
            />
            <div className="flex items-center justify-between px-10">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger className="font-bold text-sm lg:text-xl">
            Colors
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ul className="p-2 flex flex-wrap items-center gap-2">
              {colors.map(({ slug, hex, name }) => (
                <li
                  key={slug}
                  aria-label={name}
                  onClick={() => toggleFilter("color", slug)}
                  style={{ backgroundColor: hex }}
                  className={cn(
                    "flex items-center justify-center cursor-pointer size-9 rounded-full border-2",
                    filters.color === slug && "ring-2 ring-offset-2"
                  )}
                >
                  <Check
                    className={cn(
                      "w-4 h-4",
                      filters.color === slug
                        ? hex === "#ffffff"
                          ? "text-black"
                          : "text-white"
                        : "opacity-0"
                    )}
                  />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="font-bold text-sm lg:text-xl">
            Size
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ScrollArea className="h-50 pr-3">
              <ul className="grid grid-cols-2 gap-4">
                {sizes.map(({ name, slug }) => (
                  <li
                    key={slug}
                    className={cn(
                      "flex items-center justify-center px-5 py-2.5 rounded-full border text-sm bg-[#f0f0f0] cursor-pointer",
                      filters.size === slug && "bg-black text-white"
                    )}
                    onClick={() => toggleFilter("size", slug)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="font-bold text-sm lg:text-xl">
            Brand
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ScrollArea className="h-50 pr-3">
              <ul className="space-y-4">
                {brands.map(({ name, slug }) => (
                  <li
                    key={slug}
                    className={cn(
                      "flex items-center justify-between cursor-pointer",
                      filters.brand === slug && "font-semibold text-black"
                    )}
                    onClick={() => toggleFilter("brand", slug)}
                  >
                    <span className="capitalize">{name}</span>
                    <ChevronRight size={16} />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger className="font-bold text-sm lg:text-xl">
            Gender
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4">
              {["MALE", "FEMALE", "UNISEX"].map((value) => (
                <li
                  key={value}
                  className={cn(
                    "flex items-center justify-between cursor-pointer",
                    filters.gender === value && "font-semibold text-black"
                  )}
                  onClick={() => toggleFilter("gender", value)}
                >
                  <span className="capitalize">{value.toLowerCase()}</span>
                  <ChevronRight size={16} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dressStyle">
          <AccordionTrigger className="font-bold text-sm lg:text-xl">
            Dress Style
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <ul className="space-y-5.5 text-muted-foreground">
              {DRESS_STYLE_LIST.map(({ name, value }) => (
                <li
                  key={value}
                  className={cn(
                    "flex items-center justify-between cursor-pointer",
                    filters.dressStyle === value && "font-semibold text-black"
                  )}
                  onClick={() => toggleFilter("dressStyle", value)}
                >
                  <span className="capitalize">{name}</span>
                  <ChevronRight size={16} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        size="lg"
        className="w-full rounded-full"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full rounded-full mt-2"
        onClick={handleResetFilters}
      >
        Reset Filters
      </Button>
    </aside>
  );
};
