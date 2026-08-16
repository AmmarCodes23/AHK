import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";
import { deleteFromR2 } from "@/lib/r2";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireStaff();
  if (!auth) {
    return NextResponse.json({ isAuth: false }, { status: 401 });
  }
  const { id } = await context.params;
  const file = await prisma.patientFile.findUnique({ where: { id } });
  if (!file) {
    return NextResponse.json({ failure: "File not found" }, { status: 404 });
  }
  try {
    await deleteFromR2(file.objectKey);
  } catch {
    // Continue so the database record is still removed if the object is already gone.
  }
  await prisma.patientFile.delete({ where: { id } });
  return NextResponse.json({ success: "File deleted" });
}
