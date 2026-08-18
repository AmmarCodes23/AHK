"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UploadResponse = {
  success?: string;
  failure?: string;
};

type LookupPatient = {
  id?: string;
  name?: string;
  email?: string;
  mobileNumber?: string | number;
  mrnumber?: string;
};

type LookupResponse = {
  mrnumber?: string;
  failure?: string;
  patients?: LookupPatient[];
};

export default function ReportData() {
  const [resTwo, setResTwo] = useState<LookupResponse>();
  const [loading, setLoading] = useState(false);
  const [loadingtwo, setLoadingtwo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [mrnumber, setMrnumber] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mobileNumber: "",
  });

  function formSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = new FormData();
        data.append("mrnumber", mrnumber);
        if (selectedFile) {
          for (let i = 0; i < selectedFile.length; i++) {
            data.append("reports", selectedFile[i]);
          }
        }
        const dataposter = await api.post<UploadResponse>("/upload", data);
        const response = dataposter.data;
        if (response.success) {
          toast.success(response.success);
        } else {
          toast.error(response.failure || "Upload failed");
        }
      } catch (error) {
        console.log(error);
        toast.error("Upload failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setMrnumber("");
    setSelectedFile(null);
    event.currentTarget.reset();
  }

  function formTwoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingtwo(true);
    const fetchData = async () => {
      try {
        const dataposter = await api.post<LookupResponse>("/getSinglemrnumber", formData);
        const response = dataposter.data;
        setResTwo(response);
        const matches = response.patients ?? [];
        if (matches.length === 1 && matches[0].mrnumber) {
          toast.success("MR Number: " + matches[0].mrnumber);
        } else if (matches.length > 1) {
          toast.success(`${matches.length} patients found`);
        } else {
          toast.error(response.failure || "User Not Found");
        }
      } catch (error) {
        console.log(error);
        toast.error("An Error Ocurred");
      } finally {
        setLoadingtwo(false);
      }
    };
    fetchData();
  }

  return (
    <div className="container mx-auto grid gap-6 px-4 py-10 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload reports</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={formSubmit}>
            <div className="space-y-2">
              <Label htmlFor="reports">Files</Label>
              <Input
                id="reports"
                name="reports"
                type="file"
                multiple
                onChange={(e) => setSelectedFile(e.target.files)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mrnumber">MR number</Label>
              <Input
                id="mrnumber"
                name="mrnumber"
                value={mrnumber}
                onChange={(e) => setMrnumber(e.target.value)}
                placeholder="MR number"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Find MR number</CardTitle>
          <p className="text-sm text-muted-foreground">
            Search with any one of name, email, or mobile number.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={formTwoSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                placeholder="Optional"
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                placeholder="Optional"
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={(event) =>
                  setFormData({ ...formData, mobileNumber: event.target.value })
                }
                placeholder="Optional"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={
                loadingtwo ||
                (!formData.email.trim() && !formData.name.trim() && !formData.mobileNumber.trim())
              }
            >
              {loadingtwo ? <Loader2 className="animate-spin" /> : null}
              Search
            </Button>
            {resTwo?.patients && resTwo.patients.length > 0 ? (
              <ul className="divide-y rounded-lg border">
                {resTwo.patients.map((patient) => (
                  <li key={String(patient.id ?? patient.mrnumber)}>
                    <Link
                      href={patient.id ? `/seeAll/${patient.id}` : "/seeAll"}
                      className="block px-3 py-3 hover:bg-muted/50"
                    >
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.email} · {patient.mobileNumber}
                      </p>
                      <p className="mt-1 font-mono text-primary">MR {patient.mrnumber}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <Button variant="link" className="px-0" nativeButton={false} render={<Link href="/seeAll" />}>
              See All Data
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
