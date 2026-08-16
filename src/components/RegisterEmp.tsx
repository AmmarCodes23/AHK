"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RegisterEmpResponse = {
  failure?: string;
  success?: string;
};

export default function RegisterEmp() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "employee",
  });
  const [confirmpass, setconfirmpass] = useState("");

  function checkEmail() {
    if (
      formData.email.includes("@") &&
      formData.email.includes(".com") &&
      formData.email.length > 5
    ) {
      return { success: "Valid" };
    }
    return { failure: "*Invalid Email" };
  }
  function checkPass() {
    if (formData.password.length > 7) {
      return { success: "Password is good" };
    }
    return { failure: "*Password Must be at least 8 characters" };
  }
  function confirmpassword() {
    if (formData.password == confirmpass) {
      return { success: "Password is good" };
    }
    return { failure: "*Password Doesn't Match" };
  }

  const canSubmit =
    Boolean(checkEmail().success) &&
    Boolean(checkPass().success) &&
    Boolean(confirmpassword().success) &&
    formData.name.length >= 3;

  function formTwoSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const dataposter = await api.post<RegisterEmpResponse>("/register", formData);
        const response = dataposter.data;
        if (response.failure) {
          toast.error(response.failure);
        } else if (response.success) {
          toast.success(response.success);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error Occurred While Registering");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setFormData({
      email: "",
      name: "",
      password: "",
      role: "employee",
    });
    setconfirmpass("");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Register employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={formTwoSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              />
              {checkEmail().failure ? (
                <p className="text-sm text-destructive">{checkEmail().failure}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
              {formData.name.length >= 3 ? null : (
                <p className="text-sm text-destructive">*Name must be at least 3 characters</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              />
              {checkPass().failure ? (
                <p className="text-sm text-destructive">{checkPass().failure}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                required
                value={confirmpass}
                onChange={(event) => setconfirmpass(event.target.value)}
              />
              {confirmpassword().failure ? (
                <p className="text-sm text-destructive">{confirmpassword().failure}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => {
                  if (typeof value === "string") {
                    setFormData({ ...formData, role: value });
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit || loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
