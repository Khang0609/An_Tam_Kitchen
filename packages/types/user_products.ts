import { z } from "zod";
import {
  AddFoodCategoryEnum,
  AddFoodStorageLocationEnum,
} from "./food-constants";

/**
 * Schema cho sản phẩm do người dùng tự định nghĩa (Custom Products)
 */
export const UserProductSchema = z.object({
  /** ID duy nhất của sản phẩm (uuidv7) */
  id: z.uuidv7(),

  /** Tên sản phẩm */
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),

  /** Công ty/Nhà sản xuất */
  company: z.string().default("Unknown"),

  /** Mã vạch (nếu có) */
  barcode: z.string().optional(),

  /** Nhóm thực phẩm */
  category: AddFoodCategoryEnum,

  /** URL hình ảnh sản phẩm */
  imageUrl: z.string().url().optional(),

  /** Vị trí bảo quản mặc định */
  storage_location: AddFoodStorageLocationEnum,

  /** Số ngày sử dụng trước khi mở nắp */
  daysBeforeOpen: z.number().int().default(30),

  /** Số ngày sử dụng sau khi mở nắp */
  daysAfterOpen: z.number().int().default(7),

  /** Ghi chú thêm */
  note: z.string().optional(),
});

export type UserProduct = z.infer<typeof UserProductSchema>;
