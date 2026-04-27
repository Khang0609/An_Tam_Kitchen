import { User, InventoryItem } from '@repo/types';

// Mock in-memory database to be used for testing without Prisma
export const mockDatabase = {
  users: [] as User[],
  inventory: [] as InventoryItem[],
};
