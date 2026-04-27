import { Router } from 'express';
import { productController } from '@/container';
import {
  validateBody,
  validateParams,
  CreateProductBodySchema,
  UpdateProductBodySchema,
  ProductIdParamSchema,
} from '@/validation/product.validation';


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
 */
router.get(
  '/:id',
  validateParams(ProductIdParamSchema),
  productController.getById,
);

/**
 * POST /products
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
