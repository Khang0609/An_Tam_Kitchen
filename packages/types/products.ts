import { z } from 'zod';

/**
 * Danh mục thực phẩm
 */
export const FoodCategoryEnum = z.enum([
  'dairy',         // Sữa và các sản phẩm từ sữa
  'meat_poultry',  // Thịt và gia cầm
  'seafood',       // Hải sản
  'vegetables',    // Rau củ
  'fruits',        // Trái cây
  'eggs',          // Trứng
  'sauces_spices', // Gia vị và nước sốt
  'drinks',        // Đồ uống
  'frozen_food',   // Thực phẩm đông lạnh
  'snacks',        // Đồ ăn vặt
  'others'         // Khác
]);

export type FoodCategory = z.infer<typeof FoodCategoryEnum>;

/**
 * Zod schema cho dữ liệu Sản phẩm (Cả hệ thống và người dùng tạo)
 */
export const ProductSchema = z.object({
  /** ID duy nhất (uuidv7) */
  id: z.uuidv7(),

  /** Tên sản phẩm */
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  
  /** Công ty/Nhà sản xuất */
  company: z.string().min(1, "Tên công ty là bắt buộc"),

  /** Mã vạch (nếu có) */
  barcode: z.string().optional(),

  /** Danh mục sản phẩm */
  category: FoodCategoryEnum.default('others'),

  /** URL hình ảnh sản phẩm */
  imageUrl: z.url().optional(),

  // --- Quản lý nguồn gốc sản phẩm ---
  /** 
   * ID người tạo. 
   * null/undefined: Sản phẩm hệ thống (Global)
   * string: Sản phẩm riêng của người dùng
   */
  ownerId: z.string().nullable().optional(),

  /** 
   * Đánh dấu sản phẩm đã được kiểm định và hiển thị cho tất cả mọi người 
   */
  isGlobal: z.boolean().default(false),
  // ----------------------------------
  
  /** Số ngày sử dụng trước khi mở nắp */
  daysBeforeOpen: z.number().int().min(0, "Số ngày sử dụng trước khi mở nắp không được âm"),
  
  /** Số ngày sử dụng sau khi mở nắp */
  daysAfterOpen: z.number().int().min(0, "Số ngày sử dụng sau khi mở nắp không được âm"),
});

/**
 * Interface cho Products
 */
export type Product = z.infer<typeof ProductSchema>;
