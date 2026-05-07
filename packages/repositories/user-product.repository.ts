import { PrismaClient } from '@repo/database';
import { IUserProductRepository } from './interfaces.js';

export class PrismaUserProductRepository implements IUserProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    userId: string;
    name: string;
    category: string;
    storageLocation: string;
    note?: string;
  }): Promise<any> {
    return this.prisma.userProduct.create({
      data,
    });
  }

  async findAllByUserId(userId: string): Promise<any[]> {
    return this.prisma.userProduct.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.userProduct.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.userProduct.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
