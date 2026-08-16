"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FolderOpen, Loader2, Search, Trash2, UserPlus } from "lucide-react";
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

type SearchPatient = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  mrnumber: string;
  account?: { id: string; email: string } | null;
  _count?: { files: number };
};

type Category = { id: string; name: string };

type PatientFile = {
  id: string;
  title: string;
  fileDate: string;
  doctorName?: string | null;
  url: string;
  category?: Category | null;
};

type PatientDetail = SearchPatient & {
  files: PatientFile[];
};

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function PatientFiles() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPatient[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
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

  useEffect(() => {
    api.get<Category[]>("/categories").then((res) => {
      if (Array.isArray(res.data)) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get<SearchPatient[]>("/patients/search", {
          params: { q: query.trim() },
        });
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  async function loadPatient(id: string) {
    setLoadingPatient(true);
    try {
      const res = await api.get<PatientDetail>(`/patients/${id}`);
      setPatient(res.data);
      setLoginEmail(res.data.account?.email || res.data.email);
    } catch {
      toast.error("Could not load patient");
    } finally {
      setLoadingPatient(false);
    }
  }

  function selectPatient(row: SearchPatient) {
    setSelectedId(row.id);
    setQuery("");
    setResults([]);
    loadPatient(row.id);
  }

  const groupedFiles = useMemo(() => {
    const groups = new Map<string, { name: string; files: PatientFile[] }>();
    for (const item of patient?.files ?? []) {
      const key = item.category?.id ?? "uncategorized";
      const name = item.category?.name ?? "Uncategorized";
      const existing = groups.get(key);
      if (existing) existing.files.push(item);
      else groups.set(key, { name, files: [item] });
    }
    return Array.from(groups.entries());
  }, [patient]);

  async function submitUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!patient || !file || !title.trim()) return;
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
      await loadPatient(patient.id);
    } catch {
      toast.error("Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!patient) return;
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
      await loadPatient(patient.id);
    } catch {
      toast.error("Could not save portal login");
    } finally {
      setSaving(false);
    }
  }

  async function deleteFile(id: string) {
    if (!patient) return;
    try {
      const res = await api.delete<{ success?: string; failure?: string }>(`/patient-files/${id}`);
      if (res.data.failure) {
        toast.error(res.data.failure);
        return;
      }
      toast.success(res.data.success || "File deleted");
      await loadPatient(patient.id);
    } catch {
      toast.error("Could not delete file");
    }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Patient files</h1>
        <p className="text-sm text-muted-foreground">
          Search a patient, upload files, and create their portal login.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search patients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, mobile, email, or MR number"
              className="pl-9"
            />
          </div>
          {searching ? (
            <p className="text-sm text-muted-foreground">Searching...</p>
          ) : null}
          {results.length > 0 ? (
            <ul className="divide-y rounded-lg border">
              {results.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    className="flex w-full flex-col items-start gap-1 px-3 py-3 text-left hover:bg-muted/50"
                    onClick={() => selectPatient(row)}
                  >
                    <span className="font-medium">{row.name}</span>
                    <span className="text-sm text-muted-foreground">
                      MR {row.mrnumber} · {row.mobileNumber} · {row.email}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>

      {loadingPatient ? (
        <Skeleton className="h-64 w-full" />
      ) : patient ? (
        <>
          <Card>
            <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{patient.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  MR {patient.mrnumber} · {patient.mobileNumber}
                </p>
                <p className="text-sm text-muted-foreground">{patient.email}</p>
                {patient.account ? (
                  <Badge className="mt-2" variant="secondary">
                    Portal login: {patient.account.email}
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
          </Card>

          {groupedFiles.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No files yet for this patient.
              </CardContent>
            </Card>
          ) : (
            groupedFiles.map(([key, group]) => (
              <Card key={key}>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge variant="secondary">{group.files.length}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {group.files.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="flex items-center gap-2 font-medium">
                          <FolderOpen className="size-4 text-primary" />
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDate(item.fileDate)}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFile(item.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Search and select a patient to manage files.
        </p>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add file</DialogTitle>
            <DialogDescription>Upload an image or PDF for this patient.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitUpload}>
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient</Label>
              <Input id="patientName" value={patient?.name ?? ""} readOnly />
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
            <DialogTitle>{patient?.account ? "Reset portal login" : "Create portal login"}</DialogTitle>
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
