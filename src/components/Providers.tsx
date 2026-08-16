"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import AppShell from "@/components/AppShell";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
