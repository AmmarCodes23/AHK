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
    <Card className="h-full">
      <img src={imgurl} alt={Title} className="aspect-square w-full object-cover" />
      <CardContent className="flex flex-1 flex-col gap-2">
        <p className="line-clamp-2 min-h-10 font-medium">{Title}</p>
        {Price ? <p className="font-semibold text-primary">{Price}</p> : null}
        <Button
          size="sm"
          className="mt-auto w-full"
          onClick={() => {
            setIndex(id);
            setQuickview(true);
          }}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}

export function testsInRange(lowerrange: number, upperrange: number) {
  return dataesalab.filter((item) => item.id >= lowerrange && item.id <= upperrange);
}
