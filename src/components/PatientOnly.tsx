"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import Login from "@/components/Login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientOnly({ children }: { children: React.ReactNode }) {
  const { auth, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }
  if (!auth) {
    return <Login />;
  }
  if (role !== "PATIENT") {
    return (
      <div className="mx-auto max-w-sm px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Patient portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Staff accounts use the patient manager instead of this portal.
            </p>
            <Button className="w-full" nativeButton={false} render={<Link href="/patients" />}>
              Open patient files
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return <>{children}</>;
}
