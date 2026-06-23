import { z } from "zod";
import { StorageLocationEnum } from "./inventory.js";

/**
 * Represents a product Category (e.g., Dairy, Meat & Poultry).
 * Serves as a grouping mechanism and provides default fallback indicators for spoilage.
 */
export const CategorySchema = z.object({
  /** Unique identifier for the category (UUID string) */
  id: z.uuidv7(),

  /** Name of the category */
  name: z.string().min(1, "Tên danh mục là bắt buộc"),

  /**
   * Optional fallback description of indicators that a product in this category has spoiled
   * (e.g., "Check for mold, sour odor, or curdling").
   */
  defaultSpoiledSign: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

/**
 * Danh mục thực phẩm (Alias giữ để không bị lỗi import từ các file bên ngoài)
 */
export const FoodCategoryEnum = CategorySchema;
export type FoodCategory = Category;

/**
 * Zod schema cho dữ liệu Sản phẩm (Cả hệ thống và người dùng tạo)
 * Được đồng bộ hoàn toàn với cấu trúc database và domain model chuẩn
 */
export const ProductSchema = z.object({
  /** Unique identifier for the product (UUID string) */
  id: z.uuidv7(),

  /** Reference to the category this product belongs to (UUID string) */
  categoryId: z.uuidv7().nullable().optional(),

  /** Reference to the company manufacturing this product (UUID string) */
  companyId: z.uuidv7().nullable().optional(),

  /** Name of the product */
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),

  /** Unique barcode number (EAN-13, UPC, etc.) */
  barcode: z.string().nullable().optional(),

  /**
   * The default shelf life duration in days for the product when unopened.
   * Typically used to calculate expiration date from manufacture/purchase date.
   */
  shelfLifeUnopenedDays: z
    .number()
    .int()
    .min(0, "Số ngày không được âm")
    .default(30),

  /**
   * The default shelf life duration in days for the product once opened.
   * Used to adjust the safe consumption timeline after the item is opened.
   */
  shelfLifeOpenedDays: z
    .number()
    .int()
    .min(0, "Số ngày không được âm")
    .default(7),

  /**
   * The duration in days from purchase/manufacture during which the product remains completely fresh.
   * Status is considered optimal within this period.
   */
  freshDays: z.number().int().min(0, "Số ngày không được âm").default(3),

  /**
   * Safety buffer period in days before actual expiration to flag the product for early consumption
   * (e.g., warning to "use soon").
   */
  earlyConsumptionDays: z
    .number()
    .int()
    .min(0, "Số ngày không được âm")
    .default(2),

  /**
   * Safety buffer period in days before actual expiration to warn the user to inspect the product closely
   * (e.g., warning to "check before use").
   */
  checkBeforeUseDays: z
    .number()
    .int()
    .min(0, "Số ngày không được âm")
    .default(1),

  /**
   * Specific signs or indicators of spoilage for this product (e.g., separation, sour smell).
   * Set to `null` if there is no product-specific indicator, in which case the system should
   * fall back to the category's `defaultSpoiledSign`.
   */
  spoiledSign: z.string().nullable().optional(),

  /** URL hình ảnh sản phẩm */
  imageUrl: z.string().url().nullable().optional(),

  /** Vị trí bảo quản mặc định */
  storageLocation: StorageLocationEnum.default("fridge"),

  /** Đánh dấu sản phẩm đã được kiểm định và hiển thị cho tất cả mọi người */
  isQualified: z.boolean().default(false),

  // Legacy fields for backward compatibility
  daysBeforeOpen: z.number().int().min(0).optional(),
  daysAfterOpen: z.number().int().min(0).optional(),
});

/**
 * Interface cho Products
 */
export type Product = z.infer<typeof ProductSchema>;
