import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { mrnumber } = await request.json();
  try {
    const patient = await prisma.patient.findUnique({
      where: { mrnumber: String(mrnumber) },
      include: { _count: { select: { files: true } } },
    });
    const count = patient?._count.files ?? 0;
    if (count > 0) {
      return NextResponse.json({
        success: "Found Files",
        FileCount: count,
      });
    }
    return NextResponse.json({
      Error: "No Files Found",
      failure: "No Files Found",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An Error Ocurred";
    return NextResponse.json({ Error: message });
  }
}
