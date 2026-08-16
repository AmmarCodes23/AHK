import type { R2Bucket } from "@cloudflare/workers-types";

export interface Env {
  BUCKET: R2Bucket;
  API_KEY: string;
  PUBLIC_BASE_URL: string;
}

const corsHeaders: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, x-api-key",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders },
  });
}

function objectKeyFromUrl(url: URL) {
  return decodeURIComponent(url.pathname.replace(/^\/+/, ""));
}

function requireApiKey(request: Request, env: Env) {
  if (!env.API_KEY) {
    return json(500, { error: "API key not configured" });
  }
  const auth = request.headers.get("x-api-key");
  if (auth !== env.API_KEY) {
    return json(401, { error: "Unauthorized" });
  }
  return null;
}

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === "GET") {
      const key = objectKeyFromUrl(new URL(request.url));
      if (!key) {
        return json(400, { error: "Missing object key" });
      }
      const object = await env.BUCKET.get(key);
      if (!object) {
        return json(404, { error: "Not found" });
      }
      const headers = new Headers(corsHeaders);
      headers.set(
        "content-type",
        object.httpMetadata?.contentType || "application/octet-stream"
      );
      headers.set(
        "cache-control",
        object.httpMetadata?.cacheControl || "public, max-age=31536000, immutable"
      );
      headers.set("content-disposition", `inline; filename="${key.split("/").pop()}"`);
      return new Response(object.body, { headers });
    }

    if (request.method === "DELETE") {
      const unauthorized = requireApiKey(request, env);
      if (unauthorized) return unauthorized;
      const key = objectKeyFromUrl(new URL(request.url));
      if (!key) {
        return json(400, { error: "Missing object key" });
      }
      await env.BUCKET.delete(key);
      return json(200, { success: true, key });
    }

    if (request.method !== "POST") {
      return json(405, { error: "Method not allowed" });
    }

    const unauthorized = requireApiKey(request, env);
    if (unauthorized) return unauthorized;

    const form = await request.formData();
    const file = form.get("file");
    const keyOverride = form.get("key");
    const contentTypeOverride = form.get("contentType");

    if (!(file instanceof File)) {
      return json(400, { error: "Missing file" });
    }

    const key =
      typeof keyOverride === "string" && keyOverride.length > 0
        ? keyOverride
        : `${Date.now()}-${crypto.randomUUID()}-${file.name}`.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
          );

    const contentType =
      typeof contentTypeOverride === "string" && contentTypeOverride.length > 0
        ? contentTypeOverride
        : file.type || "application/octet-stream";

    const buffer = await file.arrayBuffer();
    await env.BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    const publicBase = env.PUBLIC_BASE_URL || "";
    const publicUrl = publicBase.endsWith("/")
      ? `${publicBase}${key}`
      : `${publicBase}/${key}`;

    return json(200, { key, url: publicUrl });
  },
};

export default handler;
