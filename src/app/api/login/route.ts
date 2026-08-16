import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = body.username as string | undefined;
    const password = body.password as string | undefined;

    if (!username || !password) {
      return NextResponse.json(
        { isAuth: false, failure: "Couldn't Log In" },
        { status: 401 }
      );
    }

    const user = await prisma.account.findUnique({ where: { email: username } });
    if (!user) {
      return NextResponse.json(
        { isAuth: false, failure: "Couldn't Log In" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { isAuth: false, failure: "Couldn't Log In" },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.userId = user.id;
    session.role = user.role;
    session.name = user.name;
    await session.save();

    return NextResponse.json({
      isAuth: true,
      role: user.role,
      success: "Logged In, Redirecting",
    });
  } catch {
    return NextResponse.json({ isAuth: false, failure: "Couldn't Log In" });
  }
}
