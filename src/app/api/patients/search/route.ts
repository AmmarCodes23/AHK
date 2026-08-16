import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json([]);
  }

  const patients = await prisma.patient.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { mobileNumber: { contains: q } },
        { mrnumber: { contains: q } },
      ],
    },
    take: 20,
    orderBy: { name: "asc" },
    include: {
      account: { select: { id: true, email: true } },
      _count: { select: { files: true } },
    },
  });

  return NextResponse.json(patients);
}
