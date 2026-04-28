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
  company: z.string().min(1, 'Tên công ty là bắt buộc'),
  barcode: z.string().optional(),
  category: FoodCategoryEnum.default('others'),
  imageUrl: z.url({ message: 'imageUrl phải là URL hợp lệ' }).optional(),
  ownerId: z.string().nullable().optional(),
  isGlobal: z.boolean().default(false),
  daysBeforeOpen: z
    .number({ error: 'daysBeforeOpen phải là số' })
    .int()
    .min(0, 'Số ngày trước khi mở không được âm'),
  daysAfterOpen: z
    .number({ error: 'daysAfterOpen phải là số' })
    .int()
    .min(0, 'Số ngày sau khi mở không được âm'),
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
