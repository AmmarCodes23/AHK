import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const auth = await getAuth();
  if (!auth) {
    return NextResponse.json({ isAuth: false });
  }

  const user = await prisma.account.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      patientId: true,
    },
  });
  if (!user) {
    return NextResponse.json({ isAuth: false });
  }

  return NextResponse.json(user);
}
