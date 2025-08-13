import { Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const Newsletter = () => {
  return (
    <section className="px-1 xl:px-0">
      <div className="relative container -bottom-40 md:-bottom-20 max-w-310 mx-auto pt-8 pb-7 px-6 rounded-2xl bg-black text-white grid grid-col-1 md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_350px] items-center gap-4">
        <h2 className="text-3xl lg:text-5xl uppercase font-black tracking-tight font-secondary">
          stay up to date about our latest offers
        </h2>
        <form className="space-y-3.5">
          <div className="relative">
            <Input
              className="pl-14 rounded-full bg-background text-black"
              placeholder="Enter your email address"
            />
            <Mail className="absolute top-1/2 left-5 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-full cursor-pointer"
          >
            Subscribe to Newsletter
          </Button>
        </form>
      </div>
    </section>
  );
};
