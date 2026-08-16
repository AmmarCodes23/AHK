import type { Patient, PatientTest } from "../../generated/prisma/client";
import { prisma } from "./prisma";

type PatientWithTests = Patient & { tests: PatientTest[] };

export function serializePatient(patient: PatientWithTests) {
  return {
    id: patient.id,
    email: patient.email,
    name: patient.name,
    age: patient.age,
    cnic: patient.cnic,
    gender: patient.gender,
    dob: patient.dob,
    mobileNumber: patient.mobileNumber,
    tests: patient.tests.map((test) => ({ name: test.name })),
    testPrices: patient.tests.map((test) => ({ price: test.price })),
    discount: patient.discount,
    received: patient.received,
    mrnumber: patient.mrnumber,
    infotest: patient.infotest,
  };
}

export function parseTestRows(tests: unknown, testPrices: unknown) {
  const names = Array.isArray(tests) ? tests : [];
  const prices = Array.isArray(testPrices) ? testPrices : [];
  return names.map((item, index) => {
    const name =
      typeof item === "object" && item !== null && "name" in item
        ? String((item as { name: unknown }).name)
        : String(item ?? "");
    const priceItem = prices[index];
    const price =
      typeof priceItem === "object" && priceItem !== null && "price" in priceItem
        ? Number((priceItem as { price: unknown }).price)
        : Number(priceItem ?? 0);
    return { name, price: Number.isFinite(price) ? price : 0 };
  });
}

export function toOptionalInt(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toRequiredInt(value: unknown, fallback = 0) {
  const parsed = toOptionalInt(value);
  return parsed ?? fallback;
}

export async function replacePatientTests(
  patientId: string,
  tests: unknown,
  testPrices: unknown
) {
  const rows = parseTestRows(tests, testPrices);
  await prisma.patientTest.deleteMany({ where: { patientId } });
  if (rows.length === 0) return;
  await prisma.patientTest.createMany({
    data: rows.map((row) => ({ ...row, patientId })),
  });
}
