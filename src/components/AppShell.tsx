"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";
import SiteHeader, { StaffToolbar } from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, role, setAuth } = useAuth();

  useEffect(() => {
    if (pathname !== "/logout") {
      return;
    }
    const logoutuser = async () => {
      const logout = await api.post("/logout");
      const response = logout.data;
      if (response) {
        if (response.success) {
          setAuth(false);
          router.push("/login");
        } else {
          setAuth(true);
        }
      }
    };
    logoutuser();
  }, [pathname, router, setAuth]);

  if (pathname === "/logout") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      {auth && role !== "PATIENT" ? <StaffToolbar /> : null}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <SiteFooter />
    </>
  );
}
