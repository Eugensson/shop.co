"use client";

import Link from "next/link";
import { ChevronDownIcon, MessageCircleMore } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Rating } from "@/components/rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

type RatingSummaryProps = {
  asPopover?: boolean;
  avgRating: number;
  numReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  title?: string;
  className?: string;
  onViewAllReviewsClick?: () => void;
};

export const RatingSummary = ({
  asPopover,
  avgRating = 0,
  numReviews = 0,
  ratingDistribution = [],
  title,
  className,
  onViewAllReviewsClick,
}: RatingSummaryProps) => {
  const RatingDistribution = () => {
    const ratingPercentageDistribution = ratingDistribution.map((x) => ({
      ...x,
      percentage: Math.round((x.count / numReviews) * 100),
    }));

    return (
      <section className={cn("space-y-5", className)}>
        {title && <h2 className="h4 font-bold">{title}</h2>}
        <Rating avgRating={avgRating} />
        <p className="text-sm text-muted-foreground font-medium">
          Reviews {numReviews}
        </p>

        <ul className="space-y-3">
          {ratingPercentageDistribution
            .sort((a, b) => b.rating - a.rating)
            .map(({ rating, percentage }) => (
              <li
                key={rating}
                className="grid grid-cols-[50px_1fr_30px] gap-4 items-center text-sm"
              >
                <span>
                  {rating}&nbsp;
                  {rating === 1 ? "star" : "stars"}
                </span>
                <Progress value={percentage} className="h-2" />
                <span className="text-sm text-right">{percentage}%</span>
              </li>
            ))}
        </ul>
      </section>
    );
  };

  return asPopover ? (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="[&_svg]:size-5 flex items-center gap-2 cursor-pointer"
          >
            <Rating avgRating={avgRating} />
            <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="flex flex-col gap-2">
            <RatingDistribution />
            <Separator />
            <Button
              onClick={(e) => {
                e.preventDefault();
                onViewAllReviewsClick?.();
              }}
              variant="link"
            >
              View all reviews
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Link
        href="#reviews"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        onClick={(e) => {
          e.preventDefault();
          onViewAllReviewsClick?.();
        }}
      >
        <MessageCircleMore size={16} />
        {numReviews}&nbsp;
        {numReviews === 1 ? "review" : "reviews"}
      </Link>
    </div>
  ) : (
    <RatingDistribution />
  );
};
