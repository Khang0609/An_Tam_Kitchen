import { Product, InventoryItem, User } from '@repo/types';
import { IProductRepository, IInventoryRepository, IUserRepository } from './interfaces';
/**
 * Mock Product Repository
 */
export declare class MockProductRepository implements IProductRepository {
    private products;
    create(data: Omit<Product, 'id'>): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    update(id: string, data: Partial<Product>): Promise<Product>;
    delete(id: string): Promise<boolean>;
    findByBarcode(barcode: string): Promise<Product | null>;
    findByOwner(ownerId: string): Promise<Product[]>;
    findGlobal(): Promise<Product[]>;
}
/**
 * Mock Inventory Repository
 */
export declare class MockInventoryRepository implements IInventoryRepository {
    private inventory;
    create(data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem>;
    findById(id: string): Promise<InventoryItem | null>;
    findAll(): Promise<InventoryItem[]>;
    update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem>;
    delete(id: string): Promise<boolean>;
    findAllByUserId(userId: string): Promise<InventoryItem[]>;
    findByProduct(productId: string): Promise<InventoryItem[]>;
}
/**
 * Mock User Repository
 */
export declare class MockUserRepository implements IUserRepository {
    private users;
    create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<boolean>;
    findByEmail(email: string): Promise<User | null>;
}
export declare const userRepository: MockUserRepository;
//# sourceMappingURL=mock.d.ts.map