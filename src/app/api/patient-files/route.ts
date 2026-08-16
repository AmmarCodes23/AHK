import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false, failure: "Not Authenticated" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const patientId = String(formData.get("patientId") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const dateValue = String(formData.get("date") ?? "");
    const categoryIdRaw = String(formData.get("categoryId") ?? "");
    const doctorName = String(formData.get("doctorName") ?? "").trim();

    if (!(file instanceof File) || !patientId || !title) {
      return NextResponse.json(
        { failure: "File, patient, and file name are required" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ failure: "Patient not found" }, { status: 404 });
    }

    const categoryId = categoryIdRaw || null;
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        return NextResponse.json({ failure: "Category not found" }, { status: 400 });
      }
    }

    const uploaded = await uploadToR2(file);
    const fileDate = dateValue ? new Date(dateValue) : new Date();

    const created = await prisma.patientFile.create({
      data: {
        patientId,
        categoryId,
        title,
        fileDate: Number.isNaN(fileDate.getTime()) ? new Date() : fileDate,
        doctorName: doctorName || null,
        objectKey: uploaded.key,
        url: uploaded.url,
        contentType: file.type || "application/octet-stream",
        size: file.size,
        uploadedById: auth.userId,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: "File uploaded", file: created });
  } catch {
    return NextResponse.json({ failure: "Upload failed" }, { status: 500 });
  }
}
