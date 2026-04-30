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

  /** Nhóm thực phẩm */
  category: AddFoodCategoryEnum,

  /** Vị trí bảo quản mặc định */
  storage_location: AddFoodStorageLocationEnum,

  /** Ghi chú thêm */
  note: z.string().optional(),
});

export type UserProduct = z.infer<typeof UserProductSchema>;
