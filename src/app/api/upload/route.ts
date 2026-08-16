import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const mrnumber = String(formData.get("mrnumber") ?? "");
    const files = formData.getAll("reports").filter((f): f is File => f instanceof File);

    if (!mrnumber || files.length === 0) {
      return NextResponse.json({ failure: "Missing files or MR number" });
    }

    const patient = await prisma.patient.findUnique({
      where: { mrnumber },
    });
    if (!patient) {
      return NextResponse.json({ failure: "Patient not found" });
    }

    const auth = await getAuth();
    const limited = files.slice(0, 10);

    for (const file of limited) {
      const uploaded = await uploadToR2(file);
      await prisma.patientFile.create({
        data: {
          patientId: patient.id,
          title: file.name,
          fileDate: new Date(),
          objectKey: uploaded.key,
          url: uploaded.url,
          contentType: file.type || "application/octet-stream",
          size: file.size,
          uploadedById: auth?.userId ?? null,
        },
      });
    }

    return NextResponse.json({ isAuth: true, success: "Authorized and Sent" });
  } catch {
    return NextResponse.json({ failure: "Upload failed" }, { status: 500 });
  }
}
