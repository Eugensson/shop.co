import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="bg-[#f2f0f1]">
      <div className="w-full container max-w-310 mx-auto pt-10 lg:pt-0 grid grid-cols-1 md:grid-cols-2 md:items-center md:gap-4">
        <div className="px-4 xl:px-0">
          <h2 className="mb-5 lg:mb-8 text-4xl lg:text-6xl lg:max-w-144 font-black uppercase tracking-tighter font-secondary">
            Find clothes that matches your style
          </h2>
          <p className="mb-6 lg:mb-8 text-sm lg:text-base lg:max-w-136 font-secondary text-muted-foreground tracking-tight">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Link
            href="/shop"
            className={cn(
              buttonVariants({
                variant: "default",
                size: "lg",
              }),
              "mb-5 lg:mb-12 w-full md:max-w-52 rounded-full h-13 capitalize"
            )}
          >
            shop now
          </Link>
          <ul className="flex flex-wrap gap-y-3 gap-x-7 lg:gap-x-16">
            <li className="flex flex-col">
              <h3 className="text-2xl lg:text-4xl font-bold">200+</h3>
              <p className="text-xs lg:text-base capitalize text-muted-foreground">
                international brands
              </p>
            </li>
            <li>
              <h3 className="text-2xl lg:text-4xl font-bold">2,000+</h3>
              <p className="text-xs lg:text-base capitalize text-muted-foreground">
                high-quality products
              </p>
            </li>
            <li>
              <h3 className="text-2xl lg:text-4xl font-bold">30,000+</h3>
              <p className="text-xs lg:text-base capitalize text-muted-foreground">
                happy customers
              </p>
            </li>
          </ul>
        </div>
        <div className="relative w-full h-112 xl:h-166">
          <Image
            src="/hero.jpg"
            fill
            alt="hero"
            className="w-full h-full object-cover lg:object-contain"
          />
          <Image
            src="/bigStar.png"
            width={76}
            height={76}
            alt="bigStar"
            className="absolute top-10 right-5"
          />
          <Image
            src="/star.png"
            width={44}
            height={44}
            alt="bigStar"
            className="absolute top-34 left-7"
          />
        </div>
      </div>
    </section>
  );
};
