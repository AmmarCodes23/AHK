"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Login from "@/components/Login";
import AlreadyLogged from "@/components/AlreadyLogged";

export default function LoginPage() {
  const { auth, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }
  if (auth) {
    return <AlreadyLogged />;
  }
  return <Login />;
}
