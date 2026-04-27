import { InventoryItem } from '@repo/types';
import { mockDatabase } from '@repo/database';
import { IInventoryRepository } from './interfaces';

/**
 * Repository implementation for Inventory using a Mock in-memory database.
 * (Sử dụng tạm thời thay cho Prisma khi database chưa sẵn sàng)
 */
export class InventoryRepository implements IInventoryRepository {
  private inventory = mockDatabase.inventory;

  async create(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as InventoryItem;
    
    this.inventory.push(newItem);
    return newItem;
  }

  async findById(id: string): Promise<InventoryItem | null> {
    return this.inventory.find(item => item.id === id) || null;
  }

  async findAll(): Promise<InventoryItem[]> {
    return this.inventory;
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index === -1) throw new Error(`Không tìm thấy vật phẩm với id ${id}`);
    
    this.inventory[index] = { 
      ...this.inventory[index], 
      ...data, 
      updatedAt: new Date() 
    };
    return this.inventory[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index !== -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }

  async findAllByUserId(userId: string): Promise<InventoryItem[]> {
    return this.inventory.filter(item => item.userId === userId);
  }

  async findByProduct(productId: string): Promise<InventoryItem[]> {
    return this.inventory.filter(item => item.productId === productId);
  }
}
