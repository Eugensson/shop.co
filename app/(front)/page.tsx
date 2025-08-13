import { Hero } from "@/components/hero";
import { Separator } from "@/components/ui/separator";
import { TopSelling } from "@/components/top-selling";
import { LogoTicker } from "@/components/logo-ticker";
import { NewArrivals } from "@/components/new-arrivals";
import { Testimonials } from "@/components/testimonials";
import { BrowseByDressStyle } from "@/components/browse-by-dress-style";

import { prisma } from "@/prisma/prisma";

const Homepage = async () => {
  const [newArrivalsProducts, topSellingProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isArchived: false, isNewArrival: true },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        brand: true,
        variants: true,
        images: true,
      },
      take: 4,
    }),
    prisma.product.findMany({
      where: { isArchived: false, isNewArrival: true },
      orderBy: { avgRating: "desc" },
      include: {
        category: true,
        brand: true,
        variants: true,
        images: true,
      },
      take: 4,
    }),
  ]);

  return (
    <div className="px-4 xl:px-0 h-full">
      <Hero />
      <LogoTicker />
      <NewArrivals items={newArrivalsProducts} />
      <Separator className="container max-w-310 mx-auto" />
      <TopSelling items={topSellingProducts} />
      <BrowseByDressStyle />
      <Testimonials />
    </div>
  );
};

export default Homepage;
