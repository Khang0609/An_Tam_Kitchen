import { User, InventoryItem } from '@repo/types';

// Mock in-memory database to be used for testing without Prisma

// Pre-hashed password for "Guest@123456" using argon2id
const GUEST_PASSWORD_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$O07F6AksJGqlbQLenyzQZQ$gV4Gddf4GtviksVcWayt669AdY0VsRKcuKKg6CrX4Xc";

const GUEST_USER_ID = "019318a0-0000-7000-8000-000000000001";

export const mockDatabase = {
  users: [
    {
      id: GUEST_USER_ID,
      email: "guest@antam.local",
      name: "Khách Obj...",
      password: GUEST_PASSWORD_HASH,
      refreshToken: null,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
  ] as User[],
  inventory: [] as InventoryItem[],
};
