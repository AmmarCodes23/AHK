"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BookResponse = {
  failure?: string;
  success?: string;
};

export default function BookAppoint() {
  const { book } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    age: "",
    cnic: "",
    gender: "male",
    dob: "",
    mobileNumber: "",
    searchResult: "",
    priceofsearch: "",
    discount: "",
    received: "",
    labnumber: "",
    infotest: "",
  });

  useEffect(() => {
    if (book) {
      const newInfotest = book.join("\n");
      setFormData((prev) => ({ ...prev, infotest: newInfotest }));
    }
  }, [book]);

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

  const canSubmit =
    Boolean(checkEmail().success) &&
    formData.name.length >= 3 &&
    formData.mobileNumber.length === 11 &&
    formData.infotest.length !== 0;

  function formTwoSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const fetchData = async () => {
      try {
        const dataposter = await api.post<BookResponse>("/logUser", { ...formData });
        const response = dataposter.data;
        if (response.failure) {
          toast.error(response.failure);
        } else if (response.success) {
          toast.success(response.success);
        }
      } catch (error) {
        console.log(error);
        toast.error("An Error Ocurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Book an appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={formTwoSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
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
                name="name"
                required
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
              {formData.name.length >= 3 ? null : (
                <p className="text-sm text-destructive">*Name must be at least 3 characters</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  name="age"
                  min={1}
                  max={120}
                  required
                  value={formData.age}
                  onChange={(event) => setFormData({ ...formData, age: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile number</Label>
                <Input
                  id="mobileNumber"
                  type="number"
                  name="mobileNumber"
                  required
                  value={formData.mobileNumber}
                  onChange={(event) =>
                    setFormData({ ...formData, mobileNumber: event.target.value })
                  }
                />
                {formData.mobileNumber.length === 11 ? null : (
                  <p className="text-sm text-destructive">*Mobile Number is Invalid</p>
                )}
              </div>
            </div>
            {book.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {book.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="infotest">Test information</Label>
              <Textarea
                id="infotest"
                required
                rows={6}
                value={formData.infotest}
                onChange={(event) => setFormData({ ...formData, infotest: event.target.value })}
                placeholder="Enter your Test Information..."
              />
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
