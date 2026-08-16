import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { email, fname, lname, message } = await request.json();
  try {
    const postContact = await prisma.contact.create({
      data: { email, fname, lname, message },
    });
    if (postContact) {
      return NextResponse.json(
        { success: "Contact Form Submitted" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { failure: "Contact Form Not Submitted" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ err: "An error occurred" }, { status: 400 });
  }
}
