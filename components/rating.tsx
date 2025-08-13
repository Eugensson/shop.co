import { cn } from "@/lib/utils";
import { IoStarOutline, IoStarHalf, IoStar } from "react-icons/io5";

interface RatingProps {
  avgRating: number;
  className?: string;
}

export const Rating = ({ avgRating, className }: RatingProps) => {
  const stars = [];

  const roundedRating = Math.round(avgRating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(<IoStar key={i} size={18} className="text-yellow-500" />);
    } else if (i - 0.5 === roundedRating) {
      stars.push(<IoStarHalf key={i} size={18} className="text-yellow-500" />);
    } else {
      stars.push(
        <IoStarOutline key={i} size={18} className="text-yellow-500" />
      );
    }
  }

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-1">{stars}</div>
      <span className="text-sm text-muted-foreground">
        {avgRating.toFixed(1)}/5
      </span>
    </div>
  );
};
