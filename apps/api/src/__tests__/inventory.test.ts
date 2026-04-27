import { describe, it, expect, beforeEach } from 'vitest';
import { InventoryRepository } from '@repo/repositories';
import { InventoryItem } from '@repo/types';
import { mockDatabase } from '@repo/database';

/**
 * InventoryRepository Test Suite
 * Kiểm thử logic của bản Mock Implementation.
 */
describe('InventoryRepository (Mock Implementation)', () => {
  let inventoryRepo: InventoryRepository;

  beforeEach(() => {
    // Reset dữ liệu trong mock database trước mỗi test case
    mockDatabase.inventory = [];
    inventoryRepo = new InventoryRepository();
  });

  // ─── Case 1: Create works with valid data ──────────────────────────────────
  
  describe('create()', () => {
    it('nên tạo mới một vật phẩm trong kho và lưu vào mock database', async () => {
      const inputData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: 'user-789',
        productId: 'prod-456',
        displayName: 'Sữa tươi TH True Milk',
        openedAt: null,
        expiryDate: new Date('2026-12-31'),
        location: 'fridge',
        status: 'fresh',
        notes: 'Mới mua',
        quantity: '4 hộp',
      };

      const result = await inventoryRepo.create(inputData);

      expect(result.id).toBeDefined();
      expect(result.displayName).toBe(inputData.displayName);
      expect(mockDatabase.inventory).toHaveLength(1);
      expect(mockDatabase.inventory[0].id).toBe(result.id);
    });
  });

  // ─── Case 2: Update correctly modifies status enum ──────────────────────────
  
  describe('update()', () => {
    it('nên cập nhật trạng thái (status) của vật phẩm chính xác', async () => {
      const created = await inventoryRepo.create({
        userId: 'u1',
        productId: 'p1',
        displayName: 'Test',
        openedAt: null,
        expiryDate: new Date(),
        location: 'fridge',
        status: 'fresh',
      });

      const updated = await inventoryRepo.update(created.id, { status: 'use_soon' });

      expect(updated.status).toBe('use_soon');
      // Kiểm tra xem dữ liệu trong "DB" có thay đổi không
      expect(mockDatabase.inventory[0].status).toBe('use_soon');
    });

    it('nên ném lỗi khi cập nhật vật phẩm không tồn tại', async () => {
      await expect(
        inventoryRepo.update('invalid-id', { status: 'not_recommended' })
      ).rejects.toThrow('Không tìm thấy vật phẩm với id invalid-id');
    });
  });

  // ─── Case 3: Retrieval and Deletion ─────────────────────────────────────────
  
  describe('Retrieval & Deletion', () => {
    it('nên trả về null khi findById một ID không tồn tại', async () => {
      const result = await inventoryRepo.findById('ghost-id');
      expect(result).toBeNull();
    });

    it('nên xóa thành công vật phẩm tồn tại', async () => {
      const created = await inventoryRepo.create({
        userId: 'u1',
        productId: 'p1',
        displayName: 'To be deleted',
        openedAt: null,
        expiryDate: new Date(),
        location: 'fridge',
        status: 'fresh',
      });

      const success = await inventoryRepo.delete(created.id);
      expect(success).toBe(true);
      expect(mockDatabase.inventory).toHaveLength(0);
    });

    it('nên trả về false khi xóa vật phẩm không tồn tại', async () => {
      const success = await inventoryRepo.delete('none');
      expect(success).toBe(false);
    });

    it('nên lọc đúng danh sách vật phẩm theo userId', async () => {
      await inventoryRepo.create({ userId: 'user-1', productId: 'p1', displayName: 'A', openedAt: null, expiryDate: new Date(), location: 'fridge', status: 'fresh' });
      await inventoryRepo.create({ userId: 'user-1', productId: 'p2', displayName: 'B', openedAt: null, expiryDate: new Date(), location: 'fridge', status: 'fresh' });
      await inventoryRepo.create({ userId: 'user-2', productId: 'p3', displayName: 'C', openedAt: null, expiryDate: new Date(), location: 'fridge', status: 'fresh' });

      const user1Items = await inventoryRepo.findAllByUserId('user-1');
      expect(user1Items).toHaveLength(2);
      expect(user1Items.every(i => i.userId === 'user-1')).toBe(true);
    });
  });
});
