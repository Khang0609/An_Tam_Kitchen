import { Product, InventoryItem, User } from '@repo/types';
import { mockDatabase } from '@repo/database';
import { IProductRepository, IInventoryRepository, IUserRepository } from './interfaces.js';

/**
 * Mock Product Repository
 */
export class MockProductRepository implements IProductRepository {
  private products: Product[] = [];

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const cleanData: any = { ...data };
    const shelfLifeUnopenedDays = cleanData.shelfLifeUnopenedDays ?? cleanData.daysBeforeOpen ?? 30;
    const shelfLifeOpenedDays = cleanData.shelfLifeOpenedDays ?? cleanData.daysAfterOpen ?? 7;
    const freshDays = cleanData.freshDays ?? 3;
    const earlyConsumptionDays = cleanData.earlyConsumptionDays ?? 2;
    const checkBeforeUseDays = cleanData.checkBeforeUseDays ?? 1;

    const newProduct: Product = {
      ...data,
      id: crypto.randomUUID(),
      shelfLifeUnopenedDays,
      shelfLifeOpenedDays,
      freshDays,
      earlyConsumptionDays,
      checkBeforeUseDays,
      isQualified: cleanData.isQualified ?? false,
      daysBeforeOpen: shelfLifeUnopenedDays,
      daysAfterOpen: shelfLifeOpenedDays,
    } as unknown as Product;

    this.products.push(newProduct);
    return newProduct;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    const cleanData: any = { ...data };
    const shelfLifeUnopenedDays = cleanData.shelfLifeUnopenedDays ?? cleanData.daysBeforeOpen ?? this.products[index].shelfLifeUnopenedDays;
    const shelfLifeOpenedDays = cleanData.shelfLifeOpenedDays ?? cleanData.daysAfterOpen ?? this.products[index].shelfLifeOpenedDays;

    this.products[index] = {
      ...this.products[index],
      ...data,
      shelfLifeUnopenedDays,
      shelfLifeOpenedDays,
      daysBeforeOpen: shelfLifeUnopenedDays,
      daysAfterOpen: shelfLifeOpenedDays,
    } as unknown as Product;
    return this.products[index];
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initialLength;
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.products.find(p => p.barcode === barcode) || null;
  }

  async findByOwner(ownerId: string): Promise<Product[]> {
    // All products are anonymous
    return [];
  }

  async findGlobal(): Promise<Product[]> {
    return this.products.filter(p => p.isQualified);
  }
}

/**
 * Mock Inventory Repository
 */
export class MockInventoryRepository implements IInventoryRepository {
  private inventory: InventoryItem[] = mockDatabase.inventory;

  async create(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const cleanData: any = { ...data };
    const productId = cleanData.productId ?? cleanData.userProductId;

    const newItem: InventoryItem = {
      ...data,
      id: crypto.randomUUID(),
      productId,
      userProductId: productId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as InventoryItem;
    this.inventory.push(newItem);
    return newItem;
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const item = this.inventory.find(item => item.id === id) || null;
    if (item) {
      (item as any).userProductId = item.productId;
    }
    return item;
  }

  async findAll(): Promise<InventoryItem[]> {
    this.inventory.forEach(item => {
      (item as any).userProductId = item.productId;
    });
    return this.inventory;
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index === -1) throw new Error(`Không tìm thấy vật phẩm với id ${id}`);
    
    const cleanData: any = { ...data };
    const productId = cleanData.productId ?? cleanData.userProductId ?? this.inventory[index].productId;

    this.inventory[index] = {
      ...this.inventory[index],
      ...data,
      productId,
      userProductId: productId,
      updatedAt: new Date()
    } as unknown as InventoryItem;
    return this.inventory[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.inventory.splice(index, 1);
    return true;
  }

  async findAllByUserId(userId: string): Promise<InventoryItem[]> {
    const items = this.inventory.filter(item => item.userId === userId);
    items.forEach(item => {
      (item as any).userProductId = item.productId;
    });
    return items;
  }

  async findByProduct(productId: string): Promise<InventoryItem[]> {
    const items = this.inventory.filter(item => item.productId === productId || (item as any).userProductId === productId);
    items.forEach(item => {
      (item as any).userProductId = item.productId;
    });
    return items;
  }
}

/**
 * Mock User Repository
 */
export class MockUserRepository implements IUserRepository {
  private users: User[] = mockDatabase.users;

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
    this.users.push(newUser);
    return newUser;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    this.users[index] = { ...this.users[index], ...data, updatedAt: new Date() };
    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < initialLength;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }
}

export const userRepository = new MockUserRepository();
