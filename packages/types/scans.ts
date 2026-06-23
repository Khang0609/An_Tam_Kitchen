import { z } from 'zod';
import { ProductSchema } from './products.js';

/**
 * Kết quả sau khi quét mã vạch
 */
export const BarcodeScanResultSchema = z.object({
  barcode: z.string(),
  success: z.boolean(),
  /** Thông tin sản phẩm nếu tìm thấy trong cơ sở dữ liệu */
  foundProduct: ProductSchema.nullable().optional(),
  /** Thông báo lỗi nếu không tìm thấy hoặc có lỗi kỹ thuật */
  message: z.string().optional(),
});

export type BarcodeScanResult = z.infer<typeof BarcodeScanResultSchema>;
