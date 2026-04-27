import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { StorageLocationEnum, FoodStatusEnum } from '@repo/types';

// ─── Param Schema ────────────────────────────────────────────────────────────

/**
 * Validates :id route param as UUID v7
 */
export const InventoryItemIdParamSchema = z.object({
  id: z.uuidv7({ error: 'ID vật phẩm phải là UUID v7 hợp lệ' }),
});

// ─── Body Schemas ─────────────────────────────────────────────────────────────

/**
 * Schema cho POST /inventory - thêm mới vật phẩm vào kho
 */
export const CreateInventoryItemBodySchema = z.object({
  productId: z.string().min(1, 'productId là bắt buộc'),
  displayName: z.string().min(1, 'Tên hiển thị là bắt buộc'),
  openedAt: z.coerce.date().nullable().optional(),
  expiryDate: z.coerce.date({ error: 'expiryDate phải là ngày hợp lệ' }),
  location: StorageLocationEnum.default('fridge'),
  status: FoodStatusEnum.default('fresh'),
  notes: z.string().optional(),
  quantity: z.string().optional(),
});

/**
 * Schema cho PATCH /inventory/:id - cập nhật thông tin vật phẩm
 */
export const UpdateInventoryItemBodySchema = z.object({
  openedAt: z.coerce.date().nullable().optional(),
  expiryDate: z.coerce.date().optional(),
  location: StorageLocationEnum.optional(),
  status: FoodStatusEnum.optional(),
  notes: z.string().optional(),
  quantity: z.string().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Body cập nhật không được rỗng' }
);

export type CreateInventoryItemBody = z.infer<typeof CreateInventoryItemBodySchema>;
export type UpdateInventoryItemBody = z.infer<typeof UpdateInventoryItemBodySchema>;

// ─── Middleware Factories ─────────────────────────────────────────────────────

/**
 * Re-exporting validation logic if needed, or we can import from product.validation
 * To keep it clean, let's assume we can import from a shared utility or just copy for now
 * as per project pattern in product.validation.ts
 */

export function validateBody<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateParams<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        error: 'Invalid params',
        details: result.error.issues,
      });
      return;
    }
    next();
  };
}
