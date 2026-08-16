import path from "path";
import crypto from "crypto";

type UploadResult = {
  key: string;
  url: string;
};

function workerConfig() {
  const workerUrl = process.env.WORKER_UPLOAD_URL;
  const workerApiKey = process.env.WORKER_UPLOAD_API_KEY;
  if (!workerUrl || !workerApiKey) {
    throw new Error("R2 worker configuration missing");
  }
  return { workerUrl, workerApiKey };
}

function objectKey(filename: string) {
  const ext = path.extname(filename);
  const safe = `${Date.now()}-${crypto.randomUUID()}${ext}`.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );
  return safe;
}

export async function uploadToR2(file: File): Promise<UploadResult> {
  const { workerUrl, workerApiKey } = workerConfig();
  const key = objectKey(file.name);
  const upstream = new FormData();
  upstream.append(
    "file",
    new Blob([Buffer.from(await file.arrayBuffer())], {
      type: file.type || "application/octet-stream",
    }),
    file.name
  );
  upstream.append("key", key);
  upstream.append("contentType", file.type || "application/octet-stream");

  const workerRes = await fetch(workerUrl, {
    method: "POST",
    headers: { "x-api-key": workerApiKey },
    body: upstream,
  });

  if (!workerRes.ok) {
    const error = (await workerRes.json().catch(() => ({}))) as { error?: string };
    throw new Error(error.error || "Upload worker failed");
  }

  const result = (await workerRes.json()) as UploadResult;
  return { key: result.key, url: result.url };
}

export async function deleteFromR2(key: string) {
  const { workerUrl, workerApiKey } = workerConfig();
  const url = `${workerUrl.replace(/\/$/, "")}/${encodeURIComponent(key)}`;
  const workerRes = await fetch(url, {
    method: "DELETE",
    headers: { "x-api-key": workerApiKey },
  });
  if (!workerRes.ok) {
    const error = (await workerRes.json().catch(() => ({}))) as { error?: string };
    throw new Error(error.error || "Delete worker failed");
  }
}

export async function fetchFromR2(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch file from storage");
  }
  return res;
}
