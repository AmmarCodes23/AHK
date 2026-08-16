"use client";

import { createContext, useContext, useState } from "react";
import { dataesalab } from "@/lib/constants";

type CartContextValue = {
  book: string[];
  setBook: (value: string[] | ((prev: string[]) => string[])) => void;
  addBook: (value: string) => void;
  quickview: boolean;
  setQuickview: (value: boolean) => void;
  index: number | undefined;
  setIndex: (value: number | undefined | ((prev: number | undefined) => number | undefined)) => void;
  stepIndex: (direction: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [book, setBook] = useState<string[]>([]);
  const [quickview, setQuickview] = useState(false);
  const [index, setIndex] = useState<number | undefined>();

  function addBook(value: string) {
    setBook((prev) => [...prev, value]);
  }

  function stepIndex(direction: string) {
    setIndex((current) => {
      const currentIndex = current ?? 0;
      if (direction === "prev" && currentIndex > 0) {
        return currentIndex - 1;
      }
      if (direction === "next" && currentIndex < dataesalab.length - 1) {
        return currentIndex + 1;
      }
      return currentIndex;
    });
  }

  return (
    <CartContext.Provider
      value={{
        book,
        setBook,
        addBook,
        quickview,
        setQuickview,
        index,
        setIndex,
        stepIndex,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
