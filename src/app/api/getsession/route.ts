import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession();
    if (session.userId) {
      return NextResponse.json({
        isAuth: true,
        user: session.userId,
        role: session.role,
      });
    }
    return NextResponse.json({ isAuth: false });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
