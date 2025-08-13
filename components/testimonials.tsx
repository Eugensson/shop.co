// import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Rating } from "./rating";

const items = [
  {
    id: "1",
    user: "Sarah M.",
    rating: 5,
    comment:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: "2",
    user: "Alex K.",
    rating: 5,
    comment:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: "3",
    user: "James L.",
    rating: 5,
    comment:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: "4",
    user: "Emily S.",
    rating: 5,
    comment:
      "I've been a loyal customer of Shop.co for years, and I can't recommend them enough. Their selection of clothes is always top-notch, and their customer service is exceptional.",
  },
  {
    id: "5",
    user: "Michael J.",
    rating: 5,
    comment:
      "I've been a Shop.co customer for years, and I can't recommend them enough. Their selection of clothes is always top-notch, and their customer service is exceptional.",
  },
  {
    id: "6",
    user: "Samantha D.",
    rating: 5,
    comment:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
];

export const Testimonials = () => {
  return (
    <section className="pt-13 lg:pt-20">
      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-full container mx-auto max-w-310 pt-20"
      >
        <h2 className="max-w-[60vw] lg:max-w-none absolute top-0 left-0 text-3xl lg:text-5xl text-left uppercase font-black tracking-tight font-secondary">
          our happy customers
        </h2>
        <CarouselContent>
          {items.map(({ id, user, rating, comment }) => (
            <CarouselItem
              key={id}
              className="basis-1/1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card className="py-6 px-4 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-1 text-base lg:text-xl">
                      {user}
                      <IoCheckmarkCircle size={24} className="text-[#01ab31]" />
                    </CardTitle>
                  </CardHeader>
                  <Rating avgRating={rating} className="px-4" />
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="line-clamp-5 min-h-35 lg:min-h-25">
                      {comment}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-14 lg:top-10 right-8 [&_svg:not([class*='size-'])]:size-6 font-black" />
        <CarouselNext className="top-14 lg:top-10 right-0 [&_svg:not([class*='size-'])]:size-6 font-black" />
      </Carousel>
    </section>
  );
};
