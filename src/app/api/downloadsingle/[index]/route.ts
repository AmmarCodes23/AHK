import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchFromR2 } from "@/lib/r2";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ index: string }> }
) {
  const { mrnumber } = await request.json();
  const { index } = await context.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { mrnumber: String(mrnumber) },
      include: { files: { orderBy: { createdAt: "asc" } } },
    });
    if (!patient || patient.files.length === 0) {
      return NextResponse.json(
        { err: "File metadata not found" },
        { status: 404 }
      );
    }

    const fileToDownload = patient.files[Number(index)];
    if (!fileToDownload) {
      return NextResponse.json({ err: "File not found" }, { status: 404 });
    }

    const upstream = await fetchFromR2(fileToDownload.url);
    return new Response(upstream.body, {
      headers: {
        "Content-Type": fileToDownload.contentType || "application/octet-stream",
      },
    });
  } catch {
    return NextResponse.json({ err: "An Error Occurred" }, { status: 500 });
  }
}
