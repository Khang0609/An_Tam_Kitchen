/**
 * Seed — Tạo tài khoản khách (guest) cho Bếp An Tâm.
 *
 * Chạy: pnpm --filter api db:seed
 *
 * Idempotent: nếu guest đã tồn tại thì cập nhật, không tạo trùng.
 * Self-contained: tạo PrismaClient riêng, không phụ thuộc @repo/database dist.
 */

import argon2 from "argon2";
import dotenv from "dotenv";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Load env — ưu tiên packages/database/.env rồi apps/api/.env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../packages/database/.env") });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "❌ DATABASE_URL is not set.\n" +
    "   Tạo file packages/database/.env với nội dung:\n" +
    '   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"'
  );
  process.exit(1);
}

// Resolve @prisma/client từ @repo/database nested node_modules
const require = createRequire(
  path.resolve(__dirname, "../node_modules/@repo/database/index.ts")
);
const { PrismaClient } = require("@prisma/client");
const pg = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const GUEST_EMAIL = "guest@antam.local";
const GUEST_PASSWORD = "Guest@123456";
const GUEST_NAME = "Tài khoản khách";

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await argon2.hash(GUEST_PASSWORD);

  const guest = await prisma.user.upsert({
    where: { email: GUEST_EMAIL },
    update: {
      password: hashedPassword,
      name: GUEST_NAME,
    },
    create: {
      email: GUEST_EMAIL,
      password: hashedPassword,
      name: GUEST_NAME,
    },
  });

  console.log(`✅ Guest user ready: ${guest.email} (id: ${guest.id})`);
  console.log("🌱 Seed completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
