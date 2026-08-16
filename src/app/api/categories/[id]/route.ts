import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false }, { status: 401 });
  }
  const { id } = await context.params;
  const { name } = await request.json();
  const trimmed = String(name ?? "").trim();
  if (!trimmed) {
    return NextResponse.json({ failure: "Name is required" }, { status: 400 });
  }
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name: trimmed },
    });
    return NextResponse.json({ success: "Category updated", category });
  } catch {
    return NextResponse.json({ failure: "Could not update category" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: "Category deleted" });
  } catch {
    return NextResponse.json({ failure: "Could not delete category" }, { status: 400 });
  }
}
