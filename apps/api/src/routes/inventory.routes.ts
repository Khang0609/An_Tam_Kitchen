import express, { Router } from 'express';
import { inventoryController } from '../container.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  CreateInventoryItemBodySchema,
  UpdateInventoryItemBodySchema,
  InventoryItemIdParamSchema,
} from '../validation/inventory.validation.js';


const router: Router = express.Router();

// Áp dụng xác thực cho tất cả các route trong inventory
router.use(authenticate);

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
