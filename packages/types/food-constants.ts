import { z } from "zod";

/**
 * Danh mục thực phẩm khi thêm mới (dành cho UI và validation đơn giản)
 */
export const ADD_FOOD_CATEGORIES = [
  "milk",
  "sauce",
  "canned_food",
  "sausage",
  "drink",
  "other",
] as const;

export type AddFoodCategory = (typeof ADD_FOOD_CATEGORIES)[number];

export const AddFoodCategoryEnum = z.enum(ADD_FOOD_CATEGORIES);

/**
 * Options cho Select trong UI (kèm label Tiếng Việt)
 */
export const CATEGORY_OPTIONS: Array<{ value: AddFoodCategory; label: string }> = [
  { value: "milk", label: "Sữa" },
  { value: "sauce", label: "Nước sốt / gia vị" },
  { value: "canned_food", label: "Đồ hộp" },
  { value: "sausage", label: "Xúc xích / đồ chế biến" },
  { value: "drink", label: "Đồ uống" },
  { value: "other", label: "Khác" },
];

/**
 * Vị trí bảo quản khi thêm mới
 */
export const ADD_FOOD_STORAGE_LOCATIONS = [
  "fridge",
  "freezer",
  "room",
] as const;

export type AddFoodStorageLocation =
  (typeof ADD_FOOD_STORAGE_LOCATIONS)[number];

export const AddFoodStorageLocationEnum = z.enum(ADD_FOOD_STORAGE_LOCATIONS);

/**
 * Options cho vị trí bảo quản trong UI (kèm label Tiếng Việt)
 */
export const STORAGE_LOCATION_OPTIONS: Array<{
  value: AddFoodStorageLocation;
  label: string;
}> = [
  { value: "fridge", label: "Ngăn mát" },
  { value: "freezer", label: "Ngăn đông" },
  { value: "room", label: "Nhiệt độ phòng" },
];
