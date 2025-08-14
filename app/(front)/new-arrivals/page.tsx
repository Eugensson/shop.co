import type { Metadata } from "next";

import { Nav } from "@/components/nav";
import { SortBar } from "@/components/sort-bar";
import { FilterBar } from "@/components/filter-bar";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import { PaginationBar } from "@/components/pagination-bar";
import { MobileFilterBar } from "@/components/mobile-filter-bar";

import { getSizes } from "@/actions/size.actions";
import { getColors } from "@/actions/color.actions";
import { getBrands } from "@/actions/brand.actions";
import { getCategories } from "@/actions/category.actions";
import { getNewArrivalProducts } from "@/actions/product.actions";

export const metadata: Metadata = {
  title: "New Arrivals",
};

interface NewArrivalsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    size?: string;
    color?: string;
    dressStyle?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    category?: string;
    gender?: string;
  }>;
}

const NewArrivalsPage = async ({ searchParams }: NewArrivalsPageProps) => {
  const paramsObj = await searchParams;

  const parsedPage = parseInt(paramsObj.page ?? "1", 10);
  const parsedLimit = parseInt(paramsObj.limit ?? "9", 10);
  const sort = paramsObj.sort ?? "most-popular";

  const [sizes, colors, brands, categories, productsData] = await Promise.all([
    getSizes(),
    getColors(),
    getBrands(),
    getCategories(),
    getNewArrivalProducts({
      page: parsedPage,
      limit: parsedLimit,
      sort,
      size: paramsObj.size ?? null,
      color: paramsObj.color ?? null,
      dressStyle: paramsObj.dressStyle ?? null,
      brand: paramsObj.brand ?? null,
      category: paramsObj.category ?? null,
      gender: paramsObj.gender ?? null,
      minPrice: paramsObj.minPrice ? Number(paramsObj.minPrice) : 0,
      maxPrice: paramsObj.maxPrice ? Number(paramsObj.maxPrice) : 999999,
    }),
  ]);

  const { products, totalCount, totalPages, currentPage } = productsData;

  const from = (currentPage - 1) * parsedLimit + 1;
  const to = Math.min(currentPage * parsedLimit, totalCount);

  const normalizeFilter = (
    value: string | null | undefined
  ): string | undefined => (value === null ? undefined : value);

  const initialFilters = {
    size: normalizeFilter(paramsObj.size ?? null),
    color: normalizeFilter(paramsObj.color ?? null),
    dressStyle: normalizeFilter(paramsObj.dressStyle ?? null),
    brand: normalizeFilter(paramsObj.brand ?? null),
    category: normalizeFilter(paramsObj.category ?? null),
    gender: normalizeFilter(paramsObj.gender ?? null),
    priceRange: [
      paramsObj.minPrice ? Number(paramsObj.minPrice) : 0,
      paramsObj.maxPrice ? Number(paramsObj.maxPrice) : 250,
    ] as [number, number],
  };

  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-12 lg:pb-20 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <Nav segments={[{ label: "New arrivals", href: "" }]} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-5">
        <div className="hidden lg:block">
          <FilterBar
            sizes={sizes}
            colors={colors}
            brands={brands}
            categories={categories}
            initialFilters={initialFilters}
          />
        </div>
        <div className="flex flex-col">
          <div className="mb-4 flex items-baseline lg:justify-between gap-2">
            <p className="text-2xl lg:text-3xl font-bold">New arrivals</p>
            <div className="w-full lg:w-fit flex items-baseline justify-between lg:justify-start gap-3">
              <span className="text-sm lg:text-base text-muted-foreground">
                Showing {from}–{to} of {totalCount} products
              </span>
              <MobileFilterBar>
                <FilterBar
                  sizes={sizes}
                  colors={colors}
                  brands={brands}
                  categories={categories}
                  initialFilters={initialFilters}
                />
              </MobileFilterBar>
              <SortBar className="hidden lg:flex" />
            </div>
          </div>

          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.slug} item={product} />
            ))}
          </ul>

          <Separator className="mt-8 mb-20" />
          <PaginationBar currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsPage;
