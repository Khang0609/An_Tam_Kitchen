import type { PrismaClient } from '@repo/database';
import { IInventoryRepository } from './interfaces';
import { InventoryItem } from '@repo/types';

/**
 * Prisma implementation of IInventoryRepository.
 * Thay thế InventoryRepository (mock) bằng thao tác DB thật.
 */
export class PrismaInventoryRepository implements IInventoryRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const item = await this.db.inventoryItem.create({ data });
    return item as unknown as InventoryItem;
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const item = await this.db.inventoryItem.findUnique({ where: { id } });
    return item as unknown as InventoryItem | null;
  }

  async findAll(): Promise<InventoryItem[]> {
    const items = await this.db.inventoryItem.findMany();
    return items as unknown as InventoryItem[];
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = await this.db.inventoryItem.update({
      where: { id },
      data,
    });
    return item as unknown as InventoryItem;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.inventoryItem.delete({ where: { id } });
    return true;
  }

  async findAllByUserId(userId: string): Promise<InventoryItem[]> {
    const items = await this.db.inventoryItem.findMany({ where: { userId } });
    return items as unknown as InventoryItem[];
  }

  async findByProduct(productId: string): Promise<InventoryItem[]> {
    const items = await this.db.inventoryItem.findMany({ where: { productId } });
    return items as unknown as InventoryItem[];
  }
}
