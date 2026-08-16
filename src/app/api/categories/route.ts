import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false }, { status: 401 });
  }
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { files: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false, failure: "Not Authenticated" }, { status: 401 });
  }
  const { name } = await request.json();
  const trimmed = String(name ?? "").trim();
  if (!trimmed) {
    return NextResponse.json({ failure: "Name is required" }, { status: 400 });
  }
  try {
    const category = await prisma.category.create({ data: { name: trimmed } });
    return NextResponse.json({ success: "Category created", category });
  } catch {
    return NextResponse.json({ failure: "Category already exists" }, { status: 409 });
  }
}
