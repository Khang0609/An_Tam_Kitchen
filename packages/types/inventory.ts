import { z } from 'zod';

/**
 * Các vị trí bảo quản thực phẩm
 */
export const StorageLocationEnum = z.enum(['fridge', 'freezer', 'room_temp']);
export type StorageLocation = z.infer<typeof StorageLocationEnum>;

/**
 * Trạng thái của thực phẩm dựa trên thời gian bảo quản
 */
export const FoodStatusEnum = z.enum([
  'fresh',              // Còn trong thời gian khuyến nghị
  'use_soon',           // Nên dùng sớm
  'check_before_use',   // Nên kiểm tra kỹ trước khi dùng
  'not_recommended'     // Không khuyến nghị tiếp tục để quá lâu
]);
export type FoodStatus = z.infer<typeof FoodStatusEnum>;

/**
 * Schema cho một món đồ trong tủ lạnh (Inventory Item)
 * Mọi món đồ đều được liên kết với một Product (Hệ thống hoặc Riêng tư)
 */
export const InventoryItemSchema = z.object({
  id: z.uuidv7(),
  
  /** ID người dùng sở hữu bản ghi này */
  userId: z.string(),

  /** Liên kết tới Product gốc (Foreign Key) */
  productId: z.string(),
  
  /** 
   * Tên hiển thị (Snapshot)
   * Lưu lại tên tại thời điểm thêm vào để hiển thị nhanh không cần join bảng Product
   */
  displayName: z.string().min(1),

  /** Ngày mở nắp (null nếu chưa mở) */
  openedAt: z.date().nullable().optional(),
  
  /** Hạn sử dụng ghi trên bao bì */
  expiryDate: z.date(),
  
  /** Vị trí bảo quản */
  location: StorageLocationEnum.default('fridge'),
  
  /** Trạng thái hiện tại */
  status: FoodStatusEnum.default('fresh'),
  
  /** Ghi chú thêm của người dùng */
  notes: z.string().optional(),
  
  /** Số lượng (ví dụ: "2 hộp", "500g") */
  quantity: z.string().optional(),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

/**
 * Schema cho thông báo cảnh báo
 */
export const FoodNotificationSchema = z.object({
  id: z.uuidv7(),
  inventoryItemId: z.string(),
  type: z.enum(['expiry_warning', 'open_limit_warning']),
  message: z.string(),
  isRead: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

export type FoodNotification = z.infer<typeof FoodNotificationSchema>;
