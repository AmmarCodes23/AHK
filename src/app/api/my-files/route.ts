import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePatient } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requirePatient();
  if (!auth) {
    return NextResponse.json({ isAuth: false }, { status: 401 });
  }

  const account = await prisma.account.findUnique({
    where: { id: auth.userId },
    include: {
      patient: {
        include: {
          files: {
            include: { category: true },
            orderBy: { fileDate: "desc" },
          },
        },
      },
    },
  });

  if (!account?.patient) {
    return NextResponse.json({ failure: "No patient record linked" }, { status: 404 });
  }

  const grouped = new Map<
    string,
    { id: string | null; name: string; files: typeof account.patient.files }
  >();

  for (const file of account.patient.files) {
    const key = file.categoryId ?? "uncategorized";
    const name = file.category?.name ?? "Uncategorized";
    const existing = grouped.get(key);
    if (existing) {
      existing.files.push(file);
    } else {
      grouped.set(key, { id: file.categoryId, name, files: [file] });
    }
  }

  return NextResponse.json({
    patient: {
      id: account.patient.id,
      name: account.patient.name,
      mrnumber: account.patient.mrnumber,
    },
    categories: Array.from(grouped.values()),
  });
}
