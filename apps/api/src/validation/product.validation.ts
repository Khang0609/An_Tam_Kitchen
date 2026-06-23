import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { FoodCategoryEnum } from '@repo/types';

// ─── Param Schema ────────────────────────────────────────────────────────────

/**
 * Validates :id route param as UUID v7
 */
export const ProductIdParamSchema = z.object({
  id: z.uuidv7({ message: 'ID sản phẩm phải là UUID v7 hợp lệ' }),
});

// ─── Body Schemas ─────────────────────────────────────────────────────────────

/**
 * Schema cho POST /products - tạo mới sản phẩm
 * Bỏ `id` vì server tự sinh, giữ tất cả các field còn lại.
 */
export const CreateProductBodySchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  categoryId: z.string().uuid().nullable().optional(),
  companyId: z.string().uuid().nullable().optional(),
  barcode: z.string().nullable().optional(),
  shelfLifeUnopenedDays: z.number().int().min(0).optional(),
  shelfLifeOpenedDays: z.number().int().min(0).optional(),
  freshDays: z.number().int().min(0).optional(),
  earlyConsumptionDays: z.number().int().min(0).optional(),
  checkBeforeUseDays: z.number().int().min(0).optional(),
  spoiledSign: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  storageLocation: z.enum(['fridge', 'freezer', 'room_temp']).optional(),
  isQualified: z.boolean().optional(),

  // Legacy fields for backward compatibility
  daysBeforeOpen: z.number().int().min(0).optional(),
  daysAfterOpen: z.number().int().min(0).optional(),
  category: z.any().optional(),
  company: z.string().optional(),
});

/**
 * Schema cho PATCH /products/:id - cập nhật một phần sản phẩm
 * Tất cả các field đều optional, nhưng body không được rỗng.
 */
export const UpdateProductBodySchema = CreateProductBodySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Body cập nhật không được rỗng' },
);

export type CreateProductBody = z.infer<typeof CreateProductBodySchema>;
export type UpdateProductBody = z.infer<typeof UpdateProductBodySchema>;
export type ProductIdParam = z.infer<typeof ProductIdParamSchema>;

// ─── Middleware Factories ─────────────────────────────────────────────────────

/**
 * Middleware: validate req.body với schema cho trước.
 * Parse theo Zod v4 – trả 400 + ZodError issues nếu thất bại.
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
    // Ghi đè req.body bằng dữ liệu đã được parse (đã áp dụng default, coerce…)
    req.body = result.data;
    next();
  };
}

/**
 * Middleware: validate req.params với schema cho trước.
 */
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
