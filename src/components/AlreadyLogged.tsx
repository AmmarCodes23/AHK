"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type UserInfo = {
  name?: string;
  email?: string;
  role?: string;
};

export default function AlreadyLogged() {
  const { role } = useAuth();
  const [user, setUser] = useState<UserInfo>();
  const [loading, setLoading] = useState(true);
  const destination = role === "PATIENT" ? "/portal" : "/uploadReports";

  useEffect(() => {
    const fetchusername = async () => {
      const username = await api.get<UserInfo>("/getuser");
      if (username) {
        setUser(username.data);
        setLoading(false);
      }
    };
    fetchusername();
  }, []);

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <Card>
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="size-10 text-green-600" />
          <CardTitle>You are logged in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Name</p>
            {loading ? <Skeleton className="h-5 w-40" /> : <p className="font-medium">{user?.name}</p>}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            {loading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <p className="font-medium">{user?.email}</p>
            )}
          </div>
          <Button className="w-full" nativeButton={false} render={<Link href={destination} />}>
            {role === "PATIENT" ? "Go to portal" : "Go to upload reports"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
