"use client";

import { useRef, useState } from "react";

import { ProductInfo } from "@/components/product-info";
import { ProductTabs } from "@/components/product-tabs";
import { ProductImages } from "@/components/product-images";

import { ProductForUI } from "@/types";

interface ProductPageClientProps {
  product: ProductForUI;
}

export const ProductPageClient = ({ product }: ProductPageClientProps) => {
  const [activeTab, setActiveTab] = useState("productDetails");
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  const handleViewAllReviews = () => {
    setActiveTab("ratingReviews");
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="mb-13 lg:mb-20 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10">
        <ProductImages images={product.images.map((img) => img.url)} />
        <ProductInfo
          product={product}
          onViewAllReviewsClick={handleViewAllReviews}
        />
      </div>
      <ProductTabs
        product={product}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviewsRef={reviewsRef}
      />
    </div>
  );
};
