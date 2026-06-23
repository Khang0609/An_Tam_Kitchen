import { describe, it, expect, beforeEach } from 'vitest';
import { MockProductRepository } from '@repo/repositories';
import type { Product } from '@repo/types';

// ─── Mock Data Factory ────────────────────────────────────────────────────────

/**
 * Tạo một object Product hợp lệ dùng cho test.
 * Dùng Partial<> để override từng field tuỳ ý trong từng test case.
 */
function createProductFixture(overrides: Partial<Omit<Product, 'id'>> = {}): Omit<Product, 'id'> {
  return {
    name: 'Sữa tươi TH True Milk',
    company: 'TH Group',
    barcode: '8936001720017',
    category: 'dairy' as any,
    imageUrl: 'https://example.com/th-milk.jpg',
    isQualified: true,
    shelfLifeUnopenedDays: 30,
    shelfLifeOpenedDays: 7,
    freshDays: 3,
    earlyConsumptionDays: 2,
    checkBeforeUseDays: 1,
    spoiledSign: null,
    ...overrides,
  } as unknown as Omit<Product, 'id'>;
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('MockProductRepository', () => {
  // Tạo instance mới trước mỗi test → đảm bảo các test HOÀN TOÀN ĐỘC LẬP
  let repo: MockProductRepository;

  beforeEach(() => {
    repo = new MockProductRepository();
  });

  // ── CREATE ─────────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('should create a product and return it with a generated id', async () => {
      const data = createProductFixture();
      const product = await repo.create(data);

      expect(product.id).toBeDefined();
      expect(typeof product.id).toBe('string');
      expect(product.name).toBe(data.name);
      expect(product.isQualified).toBe(true);
    });

    it('should create a custom (unqualified) product', async () => {
      const data = createProductFixture({ isQualified: false });
      const product = await repo.create(data);

      expect(product.isQualified).toBe(false);
    });

    it('should store multiple products independently', async () => {
      await repo.create(createProductFixture({ name: 'Product A' }));
      await repo.create(createProductFixture({ name: 'Product B' }));

      const all = await repo.findAll();
      expect(all).toHaveLength(2);
    });
  });

  // ── FIND BY ID ─────────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('should return the product when it exists', async () => {
      const created = await repo.create(createProductFixture());
      const found = await repo.findById(created.id);

      expect(found).not.toBeNull();
      expect(found!.id).toBe(created.id);
      expect(found!.name).toBe(created.name);
    });

    it('should return null when product does not exist (404 logic)', async () => {
      const result = await repo.findById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  // ── FIND ALL ───────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('should return an empty array when no products exist', async () => {
      const all = await repo.findAll();
      expect(all).toEqual([]);
    });

    it('should return all created products', async () => {
      await repo.create(createProductFixture({ name: 'A' }));
      await repo.create(createProductFixture({ name: 'B' }));
      await repo.create(createProductFixture({ name: 'C' }));

      const all = await repo.findAll();
      expect(all).toHaveLength(3);
    });
  });

  // ── UPDATE ─────────────────────────────────────────────────────────────────

  describe('update()', () => {
    it('should update specific fields of an existing product', async () => {
      const created = await repo.create(createProductFixture());
      const updated = await repo.update(created.id, {
        name: 'Sữa tươi có đường',
        shelfLifeOpenedDays: 5,
      });

      expect(updated.id).toBe(created.id);
      expect(updated.name).toBe('Sữa tươi có đường');
      expect(updated.shelfLifeOpenedDays).toBe(5);
    });

    it('should throw an error when updating a non-existent product', async () => {
      await expect(
        repo.update('ghost-id', { name: 'Ghost Product' }),
      ).rejects.toThrow('Product not found');
    });
  });

  // ── DELETE ─────────────────────────────────────────────────────────────────

  describe('delete()', () => {
    it('should delete an existing product and return true', async () => {
      const created = await repo.create(createProductFixture());
      const result = await repo.delete(created.id);

      expect(result).toBe(true);
      // Xác nhận đã bị xóa
      const found = await repo.findById(created.id);
      expect(found).toBeNull();
    });

    it('should return false when deleting a non-existent product', async () => {
      const result = await repo.delete('not-real-id');
      expect(result).toBe(false);
    });
  });

  // ── FIND BY BARCODE ────────────────────────────────────────────────────────

  describe('findByBarcode()', () => {
    it('should find a product by its barcode', async () => {
      await repo.create(createProductFixture({ barcode: '1234567890' }));
      const found = await repo.findByBarcode('1234567890');

      expect(found).not.toBeNull();
      expect(found!.barcode).toBe('1234567890');
    });

    it('should return null for a barcode that does not exist', async () => {
      const found = await repo.findByBarcode('0000000000');
      expect(found).toBeNull();
    });
  });

  // ── FIND BY OWNER ──────────────────────────────────────────────────────────

  describe('findByOwner()', () => {
    it('should return empty array as products are anonymous', async () => {
      await repo.create(createProductFixture({ name: 'User 1 Product' }));
      const user1Products = await repo.findByOwner('user_1');
      expect(user1Products).toHaveLength(0);
    });
  });

  // ── FIND GLOBAL ────────────────────────────────────────────────────────────

  describe('findGlobal()', () => {
    it('should return only global/qualified products', async () => {
      await repo.create(createProductFixture({ isQualified: true, name: 'Global Milk' }));
      await repo.create(createProductFixture({ isQualified: false, name: 'Private' }));

      const globals = await repo.findGlobal();
      expect(globals).toHaveLength(1);
      expect(globals[0].name).toBe('Global Milk');
    });

    it('should return an empty array when no global products exist', async () => {
      await repo.create(createProductFixture({ isQualified: false }));
      const globals = await repo.findGlobal();
      expect(globals).toHaveLength(0);
    });
  });
});
