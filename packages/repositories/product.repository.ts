import type { PrismaClient } from '@repo/database';
import { IProductRepository } from './interfaces';
import { Product } from '@repo/types';

/**
 * Prisma implementation of IProductRepository.
 * Tất cả thao tác DB đều đi qua PrismaClient được inject vào constructor.
 */
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const product = await this.db.product.create({ data });
    return product as unknown as Product;
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.db.product.findUnique({ where: { id } });
    return product as unknown as Product | null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.db.product.findMany();
    return products as unknown as Product[];
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const product = await this.db.product.update({
      where: { id },
      data,
    });
    return product as unknown as Product;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.product.delete({ where: { id } });
    return true;
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    const product = await this.db.product.findFirst({ where: { barcode } });
    return product as unknown as Product | null;
  }

  async findByOwner(ownerId: string): Promise<Product[]> {
    const products = await this.db.product.findMany({ where: { ownerId } });
    return products as unknown as Product[];
  }

  async findGlobal(): Promise<Product[]> {
    const products = await this.db.product.findMany({ where: { isGlobal: true } });
    return products as unknown as Product[];
  }
}
