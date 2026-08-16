"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactResponse = {
  success?: string;
  failure?: string;
};

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formdata, setformdata] = useState({
    fname: "",
    lname: "",
    email: "",
    message: "",
  });

  function checkifempty(data: string) {
    return data === "" || data == null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (
      checkifempty(formdata.fname) ||
      checkifempty(formdata.lname) ||
      checkifempty(formdata.email) ||
      checkifempty(formdata.message)
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const postContact = await api.post<ContactResponse>("/contactinfo", formdata);
      const response = postContact.data;
      if (response.success) {
        toast.success(response.success);
      } else {
        toast.error(response.failure || "Contact Form Not Submitted");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Got a question for us?</h1>
      <p className="mb-8 text-muted-foreground">AHK Portable X-Ray and Diagnostic</p>
      <Card>
        <CardHeader>
          <CardTitle>We are here to listen</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fname">First name{checkifempty(formdata.fname) ? "*" : ""}</Label>
                <Input
                  id="fname"
                  name="fname"
                  value={formdata.fname}
                  onChange={(event) => setformdata({ ...formdata, fname: event.target.value })}
                />
                {checkifempty(formdata.fname) ? (
                  <p className="text-sm text-destructive">Required</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lname">Last name{checkifempty(formdata.lname) ? "*" : ""}</Label>
                <Input
                  id="lname"
                  name="lname"
                  value={formdata.lname}
                  onChange={(event) => setformdata({ ...formdata, lname: event.target.value })}
                />
                {checkifempty(formdata.lname) ? (
                  <p className="text-sm text-destructive">Required</p>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email{checkifempty(formdata.email) ? "*" : ""}</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formdata.email}
                onChange={(event) => setformdata({ ...formdata, email: event.target.value })}
              />
              {checkifempty(formdata.email) ? (
                <p className="text-sm text-destructive">Required</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message{checkifempty(formdata.message) ? "*" : ""}</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formdata.message}
                onChange={(event) => setformdata({ ...formdata, message: event.target.value })}
              />
              {checkifempty(formdata.message) ? (
                <p className="text-sm text-destructive">Required</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              Send message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
