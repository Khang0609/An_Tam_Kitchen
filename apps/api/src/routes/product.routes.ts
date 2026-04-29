import express, { Router } from 'express';
import { productController } from '../container.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  validateBody,
  validateParams,
  CreateProductBodySchema,
  UpdateProductBodySchema,
  ProductIdParamSchema,
} from '../validation/product.validation.js';


// ─── Router ───────────────────────────────────────────────────────────────────

const router = express.Router() as any;

/**
 * GET /products
 */
router.get('/', productController.getAll);

/**
 * GET /products/:id
 */
router.get(
  '/:id',
  validateParams(ProductIdParamSchema),
  productController.getById,
);

// Các route thay đổi dữ liệu yêu cầu đăng nhập
router.use(authenticate);

/**
 * POST /products
 */
router.post(
  '/',
  validateBody(CreateProductBodySchema),
  productController.create,
);

/**
 * PATCH /products/:id
 */
router.patch(
  '/:id',
  validateParams(ProductIdParamSchema),
  validateBody(UpdateProductBodySchema),
  productController.update,
);

/**
 * DELETE /products/:id
 */
router.delete(
  '/:id',
  validateParams(ProductIdParamSchema),
  productController.delete,
);

export default router;
