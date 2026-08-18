"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { dataesalab } from "@/lib/constants";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function QuickView() {
  const { book, addBook, quickview, setQuickview, index, stepIndex } = useCart();
  const data = index !== undefined ? dataesalab[index] : undefined;
  const added = data ? book.includes(data.Title) : false;

  function handleAdd() {
    if (!data || added) return;
    addBook(data.Title);
    toast.success("Added to booking");
  }

  return (
    <Dialog open={quickview} onOpenChange={setQuickview}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl">
        {data ? (
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-64 bg-muted md:min-h-[28rem]">
              <img
                src={data.imgurl}
                alt={data.Title}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-6 p-6 md:p-8">
              <DialogHeader className="gap-3">
                <p className="text-sm font-medium tracking-wide text-primary uppercase">
                  Lab test
                </p>
                <DialogTitle className="text-2xl leading-tight md:text-3xl">
                  {data.Title}
                </DialogTitle>
                {data.Price ? (
                  <DialogDescription className="text-2xl font-bold text-primary">
                    {data.Price}
                  </DialogDescription>
                ) : null}
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                Book this test for home sample collection in Karachi. Our team will visit you
                at a time that works, and you can add more tests before you finalize.
              </p>
              <div className="mt-auto flex flex-col gap-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => stepIndex("prev")}
                  >
                    <ChevronLeft />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => stepIndex("next")}
                  >
                    Next
                    <ChevronRight />
                  </Button>
                </div>
                <Button size="lg" variant={added ? "secondary" : "default"} onClick={handleAdd}>
                  {added ? "Added to booking" : "Add to booking"}
                </Button>
                <Button
                  variant="link"
                  className="px-0"
                  nativeButton={false}
                  render={<Link href="/book" />}
                >
                  Finalize booking
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
