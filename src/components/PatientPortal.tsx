"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PortalFile = {
  id: string;
  title: string;
  fileDate: string;
  doctorName?: string | null;
  url: string;
  contentType: string;
};

type PortalCategory = {
  id: string | null;
  name: string;
  files: PortalFile[];
};

type MyFilesResponse = {
  patient?: { name: string; mrnumber: string };
  categories?: PortalCategory[];
  failure?: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function PatientPortal() {
  const [data, setData] = useState<MyFilesResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<MyFilesResponse>("/my-files");
        setData(response.data);
      } catch {
        setData({ categories: [] });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = data?.categories ?? [];

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your files</h1>
        {data?.patient ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {data.patient.name} · MR {data.patient.mrnumber}
          </p>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No files have been added yet.
          </CardContent>
        </Card>
      ) : (
        categories.map((category) => (
          <Card key={category.id ?? "uncategorized"}>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <Badge variant="secondary">{category.files.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.files.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-medium">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <span className="truncate">{file.title}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(file.fileDate)}
                      {file.doctorName ? ` · Dr. ${file.doctorName}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    nativeButton={false}
                    render={<a href={file.url} target="_blank" rel="noreferrer" />}
                  >
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
