"use client";

import Link from "next/link";
import { toast } from "sonner";
import { dataesalab } from "@/lib/constants";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <DialogContent className="sm:max-w-lg">
        {data ? (
          <>
            <DialogHeader>
              <DialogTitle>{data.Title}</DialogTitle>
              <DialogDescription className="text-base font-semibold text-primary">
                {data.Price}
              </DialogDescription>
            </DialogHeader>
            <img
              src={data.imgurl}
              alt={data.Title}
              className="mx-auto aspect-square max-h-64 w-full object-contain"
            />
            <DialogFooter className="sm:justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => stepIndex("prev")}>
                  Previous
                </Button>
                <Button variant="outline" onClick={() => stepIndex("next")}>
                  Next
                </Button>
              </div>
              <Button variant={added ? "secondary" : "default"} onClick={handleAdd}>
                {added ? "Added ✓" : "Add to Cart"}
              </Button>
            </DialogFooter>
            <Button variant="link" className="px-0" nativeButton={false} render={<Link href="/book" />}>
              Finalize Booking
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
