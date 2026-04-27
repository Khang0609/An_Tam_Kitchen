import { Router } from 'express';
import { InventoryRepository } from '@repo/repositories';
import { InventoryController } from '@/controllers/inventory.controller';
import {
  validateBody,
  validateParams,
  CreateInventoryItemBodySchema,
  UpdateInventoryItemBodySchema,
  InventoryItemIdParamSchema,
} from '@/validation/inventory.validation';

// ─── Dependency Injection ─────────────────────────────────────────────────────
// Hiện tại InventoryRepository đang sử dụng Mock Implementation
const inventoryRepository = new InventoryRepository();
const inventoryController = new InventoryController(inventoryRepository);

const router: Router = Router();

// Lưu ý: Middleware authenticate (JWT) nên được áp dụng ở đây hoặc trong index.ts
// để đảm bảo req.userId được thiết lập chính xác.

/**
 * POST /inventory
 * Thêm mới vật phẩm vào kho của người dùng.
 */
router.post(
  '/',
  validateBody(CreateInventoryItemBodySchema),
  inventoryController.create
);

/**
 * GET /inventory
 * Lấy danh sách vật phẩm trong kho của người dùng hiện tại.
 */
router.get(
  '/',
  inventoryController.getAll
);

/**
 * PATCH /inventory/:id
 * Cập nhật thông tin vật phẩm (số lượng, ngày mở, trạng thái).
 */
router.patch(
  '/:id',
  validateParams(InventoryItemIdParamSchema),
  validateBody(UpdateInventoryItemBodySchema),
  inventoryController.update
);

/**
 * DELETE /inventory/:id
 * Xóa vật phẩm khỏi kho.
 */
router.delete(
  '/:id',
  validateParams(InventoryItemIdParamSchema),
  inventoryController.delete
);

export default router;
