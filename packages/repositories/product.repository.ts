import type { PrismaClient } from '@repo/database';
import { IProductRepository } from './interfaces.js';
import { Product } from '@repo/types';

function mapPrismaProductToProduct(p: any): Product {
  if (!p) return p;
  return {
    ...p,
    daysBeforeOpen: p.shelfLifeUnopenedDays,
    daysAfterOpen: p.shelfLifeOpenedDays,
  } as unknown as Product;
}

/**
 * Prisma implementation of IProductRepository.
 * Tất cả thao tác DB đều đi qua PrismaClient được inject vào constructor.
 */
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const cleanData: any = { ...data };
    if (cleanData.daysBeforeOpen !== undefined) {
      cleanData.shelfLifeUnopenedDays = cleanData.daysBeforeOpen;
      delete cleanData.daysBeforeOpen;
    }
    if (cleanData.daysAfterOpen !== undefined) {
      cleanData.shelfLifeOpenedDays = cleanData.daysAfterOpen;
      delete cleanData.daysAfterOpen;
    }

    let categoryId = cleanData.categoryId;
    if (!categoryId && typeof cleanData.category === 'string') {
      const cat = await this.db.category.findFirst({
        where: { name: { equals: cleanData.category, mode: 'insensitive' } }
      });
      if (cat) categoryId = cat.id;
    }
    cleanData.categoryId = categoryId;
    delete cleanData.category;

    let companyId = cleanData.companyId;
    if (!companyId && typeof cleanData.company === 'string') {
      const comp = await this.db.company.findFirst({
        where: { name: { equals: cleanData.company, mode: 'insensitive' } }
      });
      if (comp) companyId = comp.id;
    }
    cleanData.companyId = companyId;
    delete cleanData.company;

    const product = await this.db.product.create({ data: cleanData });
    return mapPrismaProductToProduct(product);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.db.product.findUnique({ where: { id } });
    return mapPrismaProductToProduct(product);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.db.product.findMany();
    return products.map(mapPrismaProductToProduct);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const cleanData: any = { ...data };
    if (cleanData.daysBeforeOpen !== undefined) {
      cleanData.shelfLifeUnopenedDays = cleanData.daysBeforeOpen;
      delete cleanData.daysBeforeOpen;
    }
    if (cleanData.daysAfterOpen !== undefined) {
      cleanData.shelfLifeOpenedDays = cleanData.daysAfterOpen;
      delete cleanData.daysAfterOpen;
    }

    let categoryId = cleanData.categoryId;
    if (!categoryId && typeof cleanData.category === 'string') {
      const cat = await this.db.category.findFirst({
        where: { name: { equals: cleanData.category, mode: 'insensitive' } }
      });
      if (cat) categoryId = cat.id;
    }
    cleanData.categoryId = categoryId;
    delete cleanData.category;

    let companyId = cleanData.companyId;
    if (!companyId && typeof cleanData.company === 'string') {
      const comp = await this.db.company.findFirst({
        where: { name: { equals: cleanData.company, mode: 'insensitive' } }
      });
      if (comp) companyId = comp.id;
    }
    cleanData.companyId = companyId;
    delete cleanData.company;

    const product = await this.db.product.update({
      where: { id },
      data: cleanData,
    });
    return mapPrismaProductToProduct(product);
  }

  async delete(id: string): Promise<boolean> {
    await this.db.product.delete({ where: { id } });
    return true;
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    const product = await this.db.product.findFirst({ where: { barcode } });
    return mapPrismaProductToProduct(product);
  }

  async findByOwner(ownerId: string): Promise<Product[]> {
    // All products are anonymous now
    return [];
  }

  async findGlobal(): Promise<Product[]> {
    const products = await this.db.product.findMany({ where: { isQualified: true } });
    return products.map(mapPrismaProductToProduct);
  }
}
