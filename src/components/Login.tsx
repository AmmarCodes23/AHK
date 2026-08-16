"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginResponse = {
  isAuth?: boolean;
  role?: string;
  failure?: string;
  success?: string;
};

function redirectForRole(role?: string) {
  return role === "PATIENT" ? "/portal" : "/uploadReports";
}

export default function Login() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [res, setRes] = useState<LoginResponse>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const fetchData = async () => {
      try {
        const dataposter = await api.post<LoginResponse>("/login", formData);
        const response = dataposter.data;
        setRes(response);
        if (response.failure) {
          toast.error(response.failure);
        } else if (response.success) {
          toast.success(response.success);
        }
      } catch (error) {
        console.log(error);
        toast.error("Couldn't Log In");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }

  useEffect(() => {
    if (res?.isAuth) {
      refresh();
      router.push(redirectForRole(res.role));
    }
  }, [res, router, refresh]);

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <Card>
        <CardHeader className="items-center text-center">
          <LogIn className="size-8 text-primary" />
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email"
                name="username"
                value={formData.username}
                onChange={(event) =>
                  setFormData((prevVal) => ({ ...prevVal, username: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((prevVal) => ({ ...prevVal, password: event.target.value }))
                }
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
