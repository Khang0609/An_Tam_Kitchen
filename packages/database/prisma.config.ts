import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ file .env

export default defineConfig({
  datasource: {
    // Ưu tiên DIRECT_URL (bạn đã copy từ Supabase) hoặc DATABASE_URL
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
});
