"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, FileText, Loader2, Trash2, UserPlus } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type PatientTest = { name: string; price: number };
type Category = { id: string; name: string };
type PatientFile = {
  id: string;
  title: string;
  fileDate: string;
  doctorName?: string | null;
  url: string;
  category?: { id?: string; name: string } | null;
};

type PatientDetail = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  mrnumber: string;
  age: number;
  cnic?: string | null;
  gender?: string | null;
  dob?: string | null;
  discount?: number | null;
  received?: number | null;
  infotest?: string | null;
  tests?: PatientTest[];
  account?: { email: string } | null;
  files?: PatientFile[];
  failure?: string;
};

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function Info({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value || "—"}</p>
    </div>
  );
}

export default function PatientDetail({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<PatientDetail>();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayInput());
  const [doctorName, setDoctorName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function loadPatient() {
    const res = await api.get<PatientDetail>(`/patients/${patientId}`);
    setPatient(res.data);
    setLoginEmail(res.data.account?.email || res.data.email);
  }

  useEffect(() => {
    api.get<Category[]>("/categories").then((res) => {
      if (Array.isArray(res.data)) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        await loadPatient();
      } catch {
        setPatient({ failure: "Patient not found" } as PatientDetail);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  async function submitUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!patient?.id || !file || !title.trim()) return;
    setSaving(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("patientId", patient.id);
      data.append("title", title.trim());
      data.append("date", date);
      data.append("categoryId", categoryId);
      data.append("doctorName", doctorName);
      const res = await api.post<{ success?: string; failure?: string }>("/patient-files", data);
      if (res.data.failure) {
        toast.error(res.data.failure);
        return;
      }
      toast.success(res.data.success || "File uploaded");
      setUploadOpen(false);
      setFile(null);
      setTitle("");
      setDoctorName("");
      setCategoryId("");
      setDate(todayInput());
      await loadPatient();
    } catch {
      toast.error("Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!patient?.id) return;
    setSaving(true);
    try {
      const res = await api.post<{ success?: string; failure?: string }>(
        `/patients/${patient.id}/account`,
        { email: loginEmail, password: loginPassword }
      );
      if (res.data.failure) {
        toast.error(res.data.failure);
        return;
      }
      toast.success(res.data.success || "Portal login saved");
      setLoginOpen(false);
      setLoginPassword("");
      await loadPatient();
    } catch {
      toast.error("Could not save portal login");
    } finally {
      setSaving(false);
    }
  }

  async function deleteFile(id: string) {
    try {
      const res = await api.delete<{ success?: string; failure?: string }>(`/patient-files/${id}`);
      if (res.data.failure) {
        toast.error(res.data.failure);
        return;
      }
      toast.success(res.data.success || "File deleted");
      await loadPatient();
    } catch {
      toast.error("Could not delete file");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl space-y-4 px-4 py-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!patient || patient.failure) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="text-muted-foreground">{patient?.failure || "Patient not found"}</p>
            <Button variant="outline" nativeButton={false} render={<Link href="/seeAll" />}>
              Back to all patients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-10">
      <Button variant="ghost" className="px-0" nativeButton={false} render={<Link href="/seeAll" />}>
        <ArrowLeft />
        All patients
      </Button>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{patient.name}</CardTitle>
            <p className="mt-1 font-mono text-sm text-muted-foreground">MR {patient.mrnumber}</p>
            {patient.account ? (
              <Badge className="mt-2" variant="secondary">
                Portal: {patient.account.email}
              </Badge>
            ) : (
              <Badge className="mt-2" variant="outline">
                No portal login
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => setUploadOpen(true)}>Add file</Button>
            <Button variant="outline" onClick={() => setLoginOpen(true)}>
              <UserPlus />
              {patient.account ? "Reset login" : "Create login"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Info label="Email" value={patient.email} />
          <Info label="Mobile" value={patient.mobileNumber} />
          <Info label="Age" value={patient.age} />
          <Info label="Gender" value={patient.gender} />
          <Info label="Date of birth" value={patient.dob} />
          <Info label="CNIC" value={patient.cnic} />
          <Info label="Received" value={patient.received != null ? `Rs ${patient.received}` : null} />
          <Info label="Discount" value={patient.discount != null ? `Rs ${patient.discount}` : null} />
          {patient.infotest ? (
            <div className="sm:col-span-2">
              <Info label="Booking notes" value={patient.infotest} />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tests</CardTitle>
        </CardHeader>
        <CardContent>
          {patient.tests && patient.tests.length > 0 ? (
            <ul className="divide-y rounded-lg border">
              {patient.tests.map((test, index) => (
                <li key={`${test.name}-${index}`} className="flex items-center justify-between px-3 py-2">
                  <span>{test.name}</span>
                  <span className="text-muted-foreground">Rs {test.price}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No tests recorded.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patient.files && patient.files.length > 0 ? (
            patient.files.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    <FileText className="size-4 text-primary" />
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.category?.name ?? "Uncategorized"} · {formatDate(item.fileDate)}
                    {item.doctorName ? ` · Dr. ${item.doctorName}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<a href={item.url} target="_blank" rel="noreferrer" />}
                  >
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteFile(item.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No files uploaded.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add file</DialogTitle>
            <DialogDescription>Upload an image or PDF for this patient.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitUpload}>
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient</Label>
              <Input id="patientName" value={patient.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                accept="image/*,.pdf,application/pdf"
                required
                onChange={(event) => {
                  const next = event.target.files?.[0] ?? null;
                  setFile(next);
                  if (next && !title) setTitle(next.name.replace(/\.[^.]+$/, ""));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">File name</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  if (typeof value === "string") setCategoryId(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor&apos;s name (optional)</Label>
              <Input
                id="doctorName"
                value={doctorName}
                onChange={(event) => setDoctorName(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving || !file}>
                {saving ? <Loader2 className="animate-spin" /> : null}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{patient.account ? "Reset portal login" : "Create portal login"}</DialogTitle>
            <DialogDescription>
              The patient will use this email and password to view their files.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitLogin}>
            <div className="space-y-2">
              <Label htmlFor="loginEmail">Email</Label>
              <Input
                id="loginEmail"
                type="email"
                required
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginPassword">Password</Label>
              <Input
                id="loginPassword"
                type="password"
                minLength={8}
                required
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving || loginPassword.length < 8}>
                {saving ? <Loader2 className="animate-spin" /> : null}
                Save login
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
