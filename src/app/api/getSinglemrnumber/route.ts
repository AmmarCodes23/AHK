import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { serializePatient } from "@/lib/patients";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await getAuth();
  if (!auth) {
    return NextResponse.json({ isAuth: false });
  }

  const { email, name, mobileNumber } = await request.json();
  try {
    const found = await prisma.patient.findFirst({
      where: {
        email: String(email),
        name: String(name),
        mobileNumber: String(mobileNumber),
      },
      include: { tests: true },
    });
    if (found) {
      return NextResponse.json(serializePatient(found));
    }
    return NextResponse.json({
      err: "User Not Found",
      failure: "User Not Found",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An Error Ocurred";
    return NextResponse.json({ err: message, failure: "An Error Ocurred" });
  }
}
