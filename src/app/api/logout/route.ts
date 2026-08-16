import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ success: "logged out" });
  } catch {
    return NextResponse.json({ err: "Error Loggin in" });
  }
}
