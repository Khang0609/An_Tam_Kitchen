import { Router } from 'express';
import { MockProductRepository } from '@repo/repositories';
import { ProductController } from '@/controllers/product.controller';
import {
  validateBody,
  validateParams,
  CreateProductBodySchema,
  UpdateProductBodySchema,
  ProductIdParamSchema,
} from '@/validation/product.validation';

// ─── Dependency Injection ─────────────────────────────────────────────────────
//
// Đây là "Composition Root" cho Product module.
// Trong production, thay MockProductRepository bằng PrismaProductRepository.
//
//   import { PrismaProductRepository } from '@repo/repositories';
//   import { prisma } from '@repo/database';
//   const productRepository = new PrismaProductRepository(prisma);
//
const productRepository = new MockProductRepository();
const productController = new ProductController(productRepository);

// ─── Router ───────────────────────────────────────────────────────────────────

const router: Router = Router();

/**
 * GET /products
 * Query params:
 *   - ?global=true  → chỉ trả về sản phẩm isGlobal
 *   - ?ownerId=<id> → trả về sản phẩm của user cụ thể
 */
router.get('/', productController.getAll);

/**
 * GET /products/:id
 * Validate UUID v7 param trước khi vào controller.
 */
router.get(
  '/:id',
  validateParams(ProductIdParamSchema),
  productController.getById,
);

/**
 * POST /products
 * Trong production nên bảo vệ bằng middleware xác thực (JWT) và phân quyền admin.
 *
 * Ví dụ: router.post('/', authenticate, requireAdmin, ...)
 */
router.post(
  '/',
  // authenticate,     // TODO: bỏ comment khi có middleware JWT
  // requireAdmin,     // TODO: bỏ comment khi có middleware phân quyền
  validateBody(CreateProductBodySchema),
  productController.create,
);

/**
 * PATCH /products/:id
 */
router.patch(
  '/:id',
  // authenticate,
  validateParams(ProductIdParamSchema),
  validateBody(UpdateProductBodySchema),
  productController.update,
);

/**
 * DELETE /products/:id
 */
router.delete(
  '/:id',
  // authenticate,
  // requireAdmin,
  validateParams(ProductIdParamSchema),
  productController.delete,
);

export default router;
