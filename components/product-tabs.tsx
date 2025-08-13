"use client";

import { CalendarDays } from "lucide-react";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Rating } from "@/components/rating";
import { Button } from "@/components/ui/button";
import { WriteReview } from "@/components/write-review";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RatingSummary } from "@/components/rating-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProductForUI } from "@/types";
import { formatDate } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";

interface ProductTabsProps {
  product: ProductForUI;
  activeTab: string;
  setActiveTab: (value: string) => void;
  reviewsRef: React.RefObject<HTMLDivElement | null>;
}

export const ProductTabs = ({
  product,
  activeTab,
  setActiveTab,
  reviewsRef,
}: ProductTabsProps) => {
  const user = useCurrentUser();

  const handleViewAllReviews = () => {
    setActiveTab("ratingReviews");
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="productDetails">Product Details</TabsTrigger>
        <TabsTrigger value="ratingReviews">Rating & Reviews</TabsTrigger>
        <TabsTrigger value="faqs">FAQs</TabsTrigger>
      </TabsList>

      <TabsContent value="productDetails">
        <ScrollArea className="h-100 pr-4">
          <section
            className="max-w-none p-10"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </ScrollArea>
      </TabsContent>

      <TabsContent
        value="ratingReviews"
        ref={reviewsRef}
        className="py-5 lg:py-6 min-h-100"
      >
        <div className="mb-5 md:mb-6 flex items-center justify-between">
          <p>
            All Reviews&nbsp;
            <span className="text-sm text-muted-foreground">
              ({product.reviews.length})
            </span>
          </p>
          <WriteReview
            productId={product.id}
            productSlug={product.slug}
            userId={user?.id ?? ""}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-5 md:gap-10">
          <RatingSummary
            title="Rating Summary"
            avgRating={product.avgRating}
            numReviews={product.countReviews}
            ratingDistribution={
              product.ratingDistribution as [{ rating: number; count: number }]
            }
            onViewAllReviewsClick={handleViewAllReviews}
          />

          <ul className="grid gap-5">
            {product.reviews.length > 0 &&
              product.reviews.map((review) => (
                <li key={review.id}>
                  <Card className="gap-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-1 text-base lg:text-xl">
                        {review.user.name}
                        {review.isVerifiedPurchase && (
                          <IoCheckmarkCircle
                            size={24}
                            className="text-[#01ab31]"
                            title="Verified Purchase"
                            aria-label="Verified Purchase"
                          />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <Rating avgRating={review.rating} className="px-4" />
                    <CardContent>
                      <p className="line-clamp-10 min-h-10">{review.comment}</p>
                    </CardContent>
                    <CardFooter className="px-4 text-sm text-muted-foreground gap-2">
                      <CalendarDays size={16} />
                      <span>Posted on {formatDate(review.createdAt)}</span>
                    </CardFooter>
                  </Card>
                </li>
              ))}
          </ul>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="max-w-49 lg:max-w-58 rounded-full cursor-pointer"
          >
            Load More Reviews
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="faqs" className="min-h-100 p-10">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Product Information</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Our flagship product combines cutting-edge technology with sleek
                design. Built with premium materials, it offers unparalleled
                performance and reliability.
              </p>
              <p>
                Key features include advanced processing capabilities, and an
                intuitive user interface designed for both beginners and
                experts.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Shipping Details</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                We offer worldwide shipping through trusted courier partners.
                Standard delivery takes 3-5 business days, while express
                shipping ensures delivery within 1-2 business days.
              </p>
              <p>
                All orders are carefully packaged and fully insured. Track your
                shipment in real-time through our dedicated tracking portal.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Return Policy</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                We stand behind our products with a comprehensive 30-day return
                policy. If you&apos;re not completely satisfied, simply return
                the item in its original condition.
              </p>
              <p>
                Our hassle-free return process includes free return shipping and
                full refunds processed within 48 hours of receiving the returned
                item.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </Tabs>
  );
};
