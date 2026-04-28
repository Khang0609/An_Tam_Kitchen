import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrate: {
    async adapter() {
      const { Pool } = await import("pg");
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const pool = new Pool({ 
        connectionString: process.env.DIRECT_URL  // dùng DIRECT_URL cho migrate
      });
      return new PrismaPg(pool);
    },
  },
});