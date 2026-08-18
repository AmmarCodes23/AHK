"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dataesalab } from "@/lib/constants";
import { useCart } from "@/context/cart-context";

type TestCardProps = {
  id: number;
  imgurl: string;
  Title: string;
  Price?: string;
};

export default function TestCard({ id, imgurl, Title, Price }: TestCardProps) {
  const { setIndex, setQuickview } = useCart();

  return (
    <Card className="h-full gap-0 py-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={imgurl}
          alt={Title}
          className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105"
        />
        {Price ? (
          <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
            {Price}
          </span>
        ) : null}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 min-h-10 text-sm font-semibold md:text-base">{Title}</p>
        <Button
          className="mt-auto w-full"
          onClick={() => {
            setIndex(id);
            setQuickview(true);
          }}
        >
          View details
        </Button>
      </CardContent>
    </Card>
  );
}

export function testsInRange(lowerrange: number, upperrange: number) {
  return dataesalab.filter((item) => item.id >= lowerrange && item.id <= upperrange);
}
