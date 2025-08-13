import { SlidersVertical } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

export const MobileFilterBar = ({ children }: React.PropsWithChildren) => {
  return (
    <Dialog>
      <DialogTrigger className="bg-[#f0f0f0] size-8 p-2 rounded-full lg:hidden">
        <SlidersVertical size={16} />
      </DialogTrigger>
      <DialogContent className="max-w-full">
        <ScrollArea className="h-160 pr-0.5">
          <DialogHeader>
            <DialogTitle className="sr-only" />
            <DialogDescription className="sr-only" />
          </DialogHeader>
          {children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
