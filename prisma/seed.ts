import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

config({ path: ".env.local" });
config({ path: ".env" });

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  "X-Ray",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "ECG",
  "Prescription",
  "Lab Report",
];

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@ahk.local";
  const password = process.env.ADMIN_PASSWORD ?? "Admin@12345";
  const name = process.env.ADMIN_NAME ?? "Admin";

  const hash = await bcrypt.hash(password, 10);
  await prisma.account.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hash,
      name,
      role: "ADMIN",
    },
  });

  for (const categoryName of defaultCategories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
