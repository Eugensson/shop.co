"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export const ProductImages = ({ images }: { images: string[] }) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_5fr] gap-3">
      <div className="order-1 lg:order-2 relative w-full h-72.5 md:h-137.25 rounded-md overflow-hidden bg-[#f0eeed]">
        <Image
          src={images[activeImageIndex]}
          alt="Product"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="w-full h-full object-contain"
        />
      </div>
      <ul className="order-2 lg:order-1 flex lg:flex-col gap-3">
        {images.map((image, index) => (
          <li
            key={index}
            className={cn(
              "flex gap-5 rounded-md overflow-hidden bg-[#f0eeed]",
              activeImageIndex === index
                ? "border-2 border-black"
                : "border-2 border-transparent"
            )}
            onClick={() => setActiveImageIndex(index)}
          >
            <Image
              width={75}
              height={75}
              src={image}
              sizes="100vw"
              alt="Product"
              className="w-full h-full object-contain aspect-square"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
