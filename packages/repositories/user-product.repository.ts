import { PrismaClient } from '@repo/database';
import { IUserProductRepository } from './interfaces.js';

function mapPrismaProductToUserProduct(p: any): any {
  if (!p) return p;
  return {
    ...p,
    daysBeforeOpen: p.shelfLifeUnopenedDays,
    daysAfterOpen: p.shelfLifeOpenedDays,
    note: p.spoiledSign,
    storageLocation: p.storageLocation,
  };
}

export class PrismaUserProductRepository implements IUserProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    userId: string;
    name: string;
    category: string;
    storageLocation: string;
    note?: string;
  }): Promise<any> {
    let categoryId: string | undefined = undefined;
    if (data.category) {
      const cat = await this.prisma.category.findFirst({
        where: { name: { equals: data.category, mode: 'insensitive' } }
      });
      if (cat) {
        categoryId = cat.id;
      }
    }

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        categoryId,
        storageLocation: data.storageLocation as any,
        spoiledSign: data.note,
        isQualified: false,
      },
    });

    return mapPrismaProductToUserProduct(product);
  }

  async findAllByUserId(userId: string): Promise<any[]> {
    const products = await this.prisma.product.findMany({
      where: { isQualified: false },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(mapPrismaProductToUserProduct);
  }

  async findById(id: string): Promise<any | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return mapPrismaProductToUserProduct(product);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
