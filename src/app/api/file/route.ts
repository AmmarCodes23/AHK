import { NextResponse } from "next/server";
import { Readable } from "stream";
import yazl from "yazl";
import { prisma } from "@/lib/prisma";
import { fetchFromR2 } from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const { mrnumber } = await request.json();

  try {
    const patient = await prisma.patient.findUnique({
      where: { mrnumber: String(mrnumber) },
      include: { files: { orderBy: { createdAt: "asc" } } },
    });
    if (!patient || patient.files.length === 0) {
      return NextResponse.json({ err: "An Error Occurred" });
    }

    const zipfile = new yazl.ZipFile();
    for (let i = 0; i < patient.files.length; i++) {
      const upstream = await fetchFromR2(patient.files[i].url);
      const buffer = Buffer.from(await upstream.arrayBuffer());
      zipfile.addBuffer(buffer, `report${i}.png`);
    }
    zipfile.end();

    const webStream = Readable.toWeb(
      zipfile.outputStream as unknown as Readable
    ) as ReadableStream;
    return new Response(webStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=files.zip",
      },
    });
  } catch {
    return NextResponse.json({ err: "An Error Occurred" });
  }
}
