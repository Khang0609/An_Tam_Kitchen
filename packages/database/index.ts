import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DB_HOST);

export * from "@prisma/client";
export * from "./mock";
export { PrismaClient };

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
