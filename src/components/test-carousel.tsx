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
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-3">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-3/4 pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
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
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
