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
  const emailValue = String(email ?? "").trim();
  const nameValue = String(name ?? "").trim();
  const mobileValue = String(mobileNumber ?? "").trim();

  if (!emailValue && !nameValue && !mobileValue) {
    return NextResponse.json({
      failure: "Enter a name, email, or mobile number",
      patients: [],
    });
  }

  try {
    const found = await prisma.patient.findMany({
      where: {
        AND: [
          nameValue ? { name: { contains: nameValue, mode: "insensitive" } } : {},
          emailValue ? { email: { contains: emailValue, mode: "insensitive" } } : {},
          mobileValue ? { mobileNumber: { contains: mobileValue } } : {},
        ],
      },
      include: { tests: true },
      orderBy: { name: "asc" },
      take: 50,
    });

    if (found.length === 0) {
      return NextResponse.json({
        err: "User Not Found",
        failure: "User Not Found",
        patients: [],
      });
    }

    const patients = found.map(serializePatient);
    return NextResponse.json({
      patients,
      mrnumber: patients.length === 1 ? patients[0].mrnumber : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An Error Ocurred";
    return NextResponse.json({ err: message, failure: "An Error Ocurred", patients: [] });
  }
}
