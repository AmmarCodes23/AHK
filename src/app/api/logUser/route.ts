import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import {
  parseTestRows,
  replacePatientTests,
  toOptionalInt,
  toRequiredInt,
} from "@/lib/patients";

export const runtime = "nodejs";

function generateRandomInt32() {
  const hex = crypto.randomBytes(4).toString("hex");
  return parseInt(hex, 16);
}

export async function POST(request: Request) {
  try {
    const val = generateRandomInt32();
    const {
      email,
      name,
      age,
      cnic,
      gender,
      dob,
      mobileNumber,
      tests,
      testPrices,
      discount,
      received,
      infotest,
    } = await request.json();

    if (!name || !email || !age || !mobileNumber) {
      return NextResponse.json({
        error: "Missing required fields: name, email, age, or mobileNumber",
      });
    }

    const mobile = String(mobileNumber);
    const emailValue = String(email);
    const testRows = parseTestRows(tests, testPrices);

    if (infotest) {
      const existing = await prisma.patient.findFirst({
        where: { mobileNumber: mobile, email: emailValue },
        include: { tests: true },
      });

      if (existing) {
        await prisma.patient.update({
          where: { id: existing.id },
          data: { infotest: String(infotest) },
        });
        return NextResponse.json({
          success: "User Updated",
          isAuth: true,
          mrnumber: val,
        });
      }

      try {
        await prisma.patient.create({
          data: {
            email: emailValue,
            name: String(name),
            age: toRequiredInt(age),
            cnic: cnic != null ? String(cnic) : null,
            gender: gender ? String(gender) : null,
            dob: dob ? String(dob) : null,
            mobileNumber: mobile,
            mrnumber: String(val),
            received: toOptionalInt(received),
            discount: toOptionalInt(discount),
            infotest: String(infotest),
            tests: { create: testRows },
          },
        });
        return NextResponse.json({
          success: "User Created",
          isAuth: true,
          mrnumber: val,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "An Error Ocurred";
        return NextResponse.json({ err: message }, { status: 500 });
      }
    }

    const auth = await getAuth();
    if (!auth) {
      return NextResponse.json({
        isAuth: false,
        failure: "Not Authenticated",
      });
    }

    const existingUser = await prisma.patient.findFirst({
      where: { mobileNumber: mobile, email: emailValue },
      include: { tests: true },
    });

    if (!existingUser) {
      try {
        const created = await prisma.patient.create({
          data: {
            email: emailValue,
            name: String(name),
            age: toRequiredInt(age),
            cnic: cnic != null ? String(cnic) : null,
            gender: gender ? String(gender) : null,
            dob: dob ? String(dob) : null,
            mobileNumber: mobile,
            mrnumber: String(val),
            received: toOptionalInt(received),
            discount: toOptionalInt(discount),
            tests: { create: testRows },
          },
          include: { tests: true },
        });
        if (created) {
          return NextResponse.json({
            success: "User Created",
            isAuth: true,
            mrnumber: val,
          });
        }
        return NextResponse.json({
          failure: "User Not Created",
          isAuth: true,
          mrnumber: val,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "An Error Ocurred";
        return NextResponse.json(
          { err: message, failure: "An Error Ocurred" },
          { status: 500 }
        );
      }
    }

    const updated = await prisma.patient.update({
      where: { id: existingUser.id },
      data: {
        cnic: cnic != null ? String(cnic) : existingUser.cnic,
        gender: gender ? String(gender) : existingUser.gender,
        dob: dob ? String(dob) : existingUser.dob,
        received: toOptionalInt(received),
        discount: toOptionalInt(discount),
      },
    });
    await replacePatientTests(existingUser.id, tests, testPrices);
    if (updated) {
      return NextResponse.json({ success: "User Updated", isAuth: true });
    }
    return NextResponse.json({ failure: "User Not Updated", isAuth: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An Error Ocurred";
    return NextResponse.json(
      { err: message, failure: "An Error Ocurred" },
      { status: 500 }
    );
  }
}
