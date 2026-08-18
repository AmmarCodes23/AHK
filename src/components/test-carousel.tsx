"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TestCard, { testsInRange } from "@/components/test-card";

type TestCarouselProps = {
  title: string;
  lowerrange: number;
  upperrange: number;
};

export default function TestCarousel({ title, lowerrange, upperrange }: TestCarouselProps) {
  const items = testsInRange(lowerrange, upperrange);

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      </div>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-[80%] pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <TestCard
                id={item.id}
                imgurl={item.imgurl}
                Title={item.Title}
                Price={item.Price}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-10 border-0 bg-background/95 shadow-md sm:flex" />
        <CarouselNext className="right-2 size-10 border-0 bg-background/95 shadow-md sm:flex" />
      </Carousel>
    </section>
  );
}
