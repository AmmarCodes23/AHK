import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";
import type { Role } from "../../../../generated/prisma/client";

export const runtime = "nodejs";

const saltingRounds = 10;

function toStaffRole(role: unknown): Role {
  return String(role).toUpperCase() === "ADMIN" ? "ADMIN" : "EMPLOYEE";
}

export async function POST(request: Request) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({
      isAuth: false,
      failure: "Error Occurred While Registering",
    });
  }

  const { email, password, role, name } = await request.json();

  try {
    const check = await prisma.account.findUnique({ where: { email } });
    if (check) {
      return NextResponse.json({
        failure: "User Already Exists, Try logging in.",
      });
    }

    const hash = await bcrypt.hash(password, saltingRounds);
    const newUser = await prisma.account.create({
      data: {
        email,
        password: hash,
        role: toStaffRole(role),
        name,
      },
    });

    if (newUser) {
      return NextResponse.json({ success: "Registered Successfully" });
    }
    return NextResponse.json({ failure: "Error Occurred While Registering" });
  } catch {
    return NextResponse.json({
      err: "Error Creating User",
      failure: "Error Occurred While Registering",
    });
  }
}
