"use client";

import Link from "next/link";
import { toast } from "sonner";
import { servicedData } from "@/lib/constants";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";

export default function Dynamic({ test }: { test: string }) {
  const { book, addBook } = useCart();
  const decoded = decodeURIComponent(test);

  return (
    <div className="container mx-auto px-4 py-12">
      {servicedData.map((data) => {
        if (decoded !== data.about) return null;
        const added = book.includes(data.about);
        return (
          <div key={data.about} className="grid items-center gap-10 md:grid-cols-2">
            <img
              src={data.imgurl}
              alt={data.about}
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{data.about}</h1>
              <p className="leading-relaxed text-muted-foreground">{data.Text}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant={added ? "secondary" : "default"}
                  onClick={() => {
                    if (!added) {
                      addBook(data.about);
                      toast.success("Added to booking");
                    }
                  }}
                >
                  {added ? "Added ✓" : "Add to Cart"}
                </Button>
                <Button variant="outline" nativeButton={false} render={<Link href="/book" />}>
                  Check Your Booking
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
