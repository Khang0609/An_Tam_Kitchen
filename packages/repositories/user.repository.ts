import type { PrismaClient } from '@repo/database';
import { IUserRepository } from './interfaces.js';
import { User } from '@repo/types';

/**
 * Prisma implementation of IUserRepository.
 * Thay thế MockUserRepository bằng thao tác DB thật.
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user = await this.db.user.create({ data });
    return user as unknown as User;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { id } });
    return user as unknown as User | null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.db.user.findMany();
    return users as unknown as User[];
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.db.user.update({
      where: { id },
      data,
    });
    return user as unknown as User;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.user.delete({ where: { id } });
    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { email } });
    return user as unknown as User | null;
  }
}
