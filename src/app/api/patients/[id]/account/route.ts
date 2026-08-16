import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false, failure: "Not Authenticated" }, { status: 401 });
  }

  const { id } = await context.params;
  const { email, password } = await request.json();
  const loginEmail = String(email ?? "").trim().toLowerCase();
  const loginPassword = String(password ?? "");

  if (!loginEmail || loginPassword.length < 8) {
    return NextResponse.json(
      { failure: "Email and a password of at least 8 characters are required" },
      { status: 400 }
    );
  }

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { account: true },
  });
  if (!patient) {
    return NextResponse.json({ failure: "Patient not found" }, { status: 404 });
  }

  const hash = await bcrypt.hash(loginPassword, 10);
  const existingEmail = await prisma.account.findUnique({ where: { email: loginEmail } });

  try {
    if (patient.account) {
      if (existingEmail && existingEmail.id !== patient.account.id) {
        return NextResponse.json({ failure: "Email already in use" }, { status: 409 });
      }
      const updated = await prisma.account.update({
        where: { id: patient.account.id },
        data: { email: loginEmail, password: hash, name: patient.name, role: "PATIENT" },
        select: { id: true, email: true },
      });
      return NextResponse.json({ success: "Portal login updated", account: updated });
    }

    if (existingEmail) {
      return NextResponse.json({ failure: "Email already in use" }, { status: 409 });
    }

    const created = await prisma.account.create({
      data: {
        email: loginEmail,
        password: hash,
        name: patient.name,
        role: "PATIENT",
        patientId: patient.id,
      },
      select: { id: true, email: true },
    });
    return NextResponse.json({ success: "Portal login created", account: created });
  } catch {
    return NextResponse.json({ failure: "Could not save portal login" }, { status: 500 });
  }
}
