import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false }, { status: 401 });
  }
  const { id } = await context.params;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      account: { select: { id: true, email: true } },
      files: {
        include: { category: true },
        orderBy: { fileDate: "desc" },
      },
    },
  });
  if (!patient) {
    return NextResponse.json({ failure: "Patient not found" }, { status: 404 });
  }
  return NextResponse.json(patient);
}
