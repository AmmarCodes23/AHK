import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { serializePatient } from "@/lib/patients";

export const runtime = "nodejs";

export async function GET() {
  const auth = await getAuth();
  if (!auth) {
    return NextResponse.json({ isAuth: false });
  }

  try {
    const found = await prisma.patient.findMany({ include: { tests: true } });
    return NextResponse.json(found.map(serializePatient));
  } catch (err) {
    const message = err instanceof Error ? err.message : "An Error Ocurred";
    return NextResponse.json({ err: message });
  }
}
