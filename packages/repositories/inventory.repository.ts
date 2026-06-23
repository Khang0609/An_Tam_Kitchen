import type { PrismaClient } from '@repo/database';
import { IInventoryRepository } from './interfaces.js';
import { InventoryItem } from '@repo/types';

function mapPrismaInventoryToInventory(item: any): any {
  if (!item) return item;
  const mapped = {
    ...item,
    userProductId: item.productId,
  };
  if (item.product) {
    mapped.userProduct = {
      ...item.product,
      daysBeforeOpen: item.product.shelfLifeUnopenedDays,
      daysAfterOpen: item.product.shelfLifeOpenedDays,
    };
  }
  return mapped;
}

/**
 * Prisma implementation of IInventoryRepository.
 * Thay thế InventoryRepository (mock) bằng thao tác DB thật.
 */
export class PrismaInventoryRepository implements IInventoryRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const cleanData: any = { ...data };
    if (cleanData.userProductId !== undefined) {
      cleanData.productId = cleanData.userProductId;
      delete cleanData.userProductId;
    }

    const item = await this.db.inventoryItem.create({
      data: cleanData,
      include: { product: true },
    });
    return mapPrismaInventoryToInventory(item) as unknown as InventoryItem;
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const item = await this.db.inventoryItem.findUnique({
      where: { id },
      include: { product: true },
    });
    return mapPrismaInventoryToInventory(item) as unknown as InventoryItem | null;
  }

  async findAll(): Promise<InventoryItem[]> {
    const items = await this.db.inventoryItem.findMany({
      include: { product: true },
    });
    return items.map(mapPrismaInventoryToInventory) as unknown as InventoryItem[];
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    const cleanData: any = { ...data };
    if (cleanData.userProductId !== undefined) {
      cleanData.productId = cleanData.userProductId;
      delete cleanData.userProductId;
    }

    const item = await this.db.inventoryItem.update({
      where: { id },
      data: cleanData,
      include: { product: true },
    });
    return mapPrismaInventoryToInventory(item) as unknown as InventoryItem;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.inventoryItem.delete({ where: { id } });
    return true;
  }

  async findAllByUserId(userId: string): Promise<InventoryItem[]> {
    const items = await this.db.inventoryItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { updatedAt: 'desc' },
    });
    return items.map(mapPrismaInventoryToInventory) as unknown as InventoryItem[];
  }

  async findByProduct(productId: string): Promise<InventoryItem[]> {
    const items = await this.db.inventoryItem.findMany({
      where: { productId },
      include: { product: true },
    });
    return items.map(mapPrismaInventoryToInventory) as unknown as InventoryItem[];
  }
}
