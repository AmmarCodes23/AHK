"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FileCountResponse = {
  success?: string;
  failure?: string;
  FileCount?: number;
};

export default function Report() {
  const [fileCountonpage, setFileCount] = useState<number>();
  const [fileloaders, setfileLoaders] = useState<boolean[]>([]);
  const [download, setdownload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mrnumber, setMrnumber] = useState("");

  async function singlefiledown(event: React.MouseEvent, index: number) {
    event.preventDefault();
    setfileLoaders((prev) => {
      const newFileLoaders = [...prev];
      newFileLoaders[index] = true;
      return newFileLoaders;
    });
    try {
      const response = await api.post(
        `/downloadsingle/${index}`,
        { mrnumber: mrnumber },
        { responseType: "blob" }
      );

      const contentType = response.headers["content-type"] as string;
      let extension = "";

      if (contentType.includes("pdf")) {
        extension = "pdf";
      } else if (contentType.includes("image/jpeg")) {
        extension = "jpg";
      } else if (contentType.includes("image/png")) {
        extension = "png";
      } else {
        extension = "bin";
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reports.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    } finally {
      setfileLoaders((prev) => {
        const newFileLoaders = [...prev];
        newFileLoaders[index] = false;
        return newFileLoaders;
      });
    }
  }

  useEffect(() => {
    const initialLoaders = Array(fileCountonpage).fill(false);
    setfileLoaders(initialLoaders);
  }, [fileCountonpage]);

  async function alldown(event: React.MouseEvent) {
    event.preventDefault();
    setdownload(true);
    try {
      const response = await api.post(
        "/file",
        { mrnumber: mrnumber },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "files.zip");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    } finally {
      setdownload(false);
    }
  }

  function showAll(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const fetchInfo = async () => {
      const fileCount = await api.post<FileCountResponse>("/getfileCount", {
        mrnumber: mrnumber,
      });
      setLoading(false);
      const response = fileCount.data;
      if (response.success) {
        toast.success(response.success);
        setFileCount(response.FileCount);
      } else {
        toast.error(response.failure || "No Files Found");
      }
    };
    fetchInfo();
  }

  if (fileCountonpage && fileCountonpage > 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Reports for MR {mrnumber}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: fileCountonpage }, (_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-primary" />
                  <p className="font-medium">Report {index + 1}</p>
                </div>
                <Button onClick={(event) => singlefiledown(event, index)}>
                  {fileloaders[index] ? <Loader2 className="animate-spin" /> : "Download"}
                </Button>
              </div>
            ))}
            <Button className="w-full" onClick={alldown} disabled={download}>
              {download ? <Loader2 className="animate-spin" /> : "Download All (.zip)"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>View reports</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={showAll}>
            <div className="space-y-2">
              <Label htmlFor="mrnumber">MR number</Label>
              <Input
                id="mrnumber"
                name="mrnumber"
                placeholder="Enter MR number"
                onChange={(event) => setMrnumber(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
