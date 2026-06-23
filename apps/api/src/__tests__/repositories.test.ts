import { describe, it, expect } from 'vitest';
import { MockProductRepository, MockInventoryRepository } from '@repo/repositories';

describe('Backend Repositories (Mock)', () => {
  const productRepo = new MockProductRepository();
  const inventoryRepo = new MockInventoryRepository();

  it('should manage private product catalog workflow', async () => {
    // 1. Create a private product for a user
    const privateProduct = await productRepo.create({
      name: 'User Homemade Jam',
      company: 'User Kitchen',
      isQualified: false,
      category: 'others' as any,
      daysBeforeOpen: 30,
      daysAfterOpen: 7
    } as any);

    expect(privateProduct.isQualified).toBe(false);

    // 2. Add to user inventory
    const item = await inventoryRepo.create({
      userId: 'user_1',
      productId: privateProduct.id,
      userProductId: privateProduct.id,
      displayName: privateProduct.name,
      expiryDate: new Date('2026-12-31'),
      location: 'fridge',
      status: 'fresh'
    } as any);

    expect(item.productId).toBe(privateProduct.id);
    expect(item.displayName).toBe('User Homemade Jam');

    // 3. Find by user
    const userItems = await inventoryRepo.findAllByUserId('user_1');
    expect(userItems.length).toBe(1);
    expect(userItems[0].id).toBe(item.id);
  });

  it('should find global products', async () => {
    await productRepo.create({
      name: 'Global Milk',
      company: 'Big Co',
      isQualified: true,
      category: 'dairy' as any,
      daysBeforeOpen: 10,
      daysAfterOpen: 3
    } as any);

    const globals = await productRepo.findGlobal();
    expect(globals.some(p => p.name === 'Global Milk')).toBe(true);
  });
});
