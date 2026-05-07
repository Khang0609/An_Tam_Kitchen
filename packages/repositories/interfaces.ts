import { Product, InventoryItem, User } from '@repo/types';
/**
 * Base Repository interface for standard CRUD operations
 */
export interface IBaseRepository<T, CreateDTO, UpdateDTO> {
  create(data: CreateDTO): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<boolean>;
}

/**
 * Product Repository Interface
 */
export interface IProductRepository extends IBaseRepository<Product, Omit<Product, 'id'>, Partial<Product>> {
  findByBarcode(barcode: string): Promise<Product | null>;
  findByOwner(ownerId: string): Promise<Product[]>;
  findGlobal(): Promise<Product[]>;
}

/**
 * Inventory Repository Interface
 */
export interface IInventoryRepository extends IBaseRepository<InventoryItem, Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>, Partial<InventoryItem>> {
  findAllByUserId(userId: string): Promise<InventoryItem[]>;
  findByProduct(productId: string): Promise<InventoryItem[]>;
}

/**
 * User Repository Interface
 */
export interface IUserRepository extends IBaseRepository<User, Omit<User, 'id' | 'createdAt' | 'updatedAt'>, Partial<User>> {
  findByEmail(email: string): Promise<User | null>;
}

/**
 * User Product Repository Interface
 */
export interface IUserProductRepository {
  create(data: any): Promise<any>;
  findAllByUserId(userId: string): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  delete(id: string): Promise<boolean>;
}
