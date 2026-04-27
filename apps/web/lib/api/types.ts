import type {
  FoodCategory,
  FoodStatus,
  InventoryItem,
  Product,
  StorageLocation,
} from "@repo/types";

export type FoodDataSource = "api" | "mock";

export type AddFoodCategory =
  | "milk"
  | "sauce"
  | "canned_food"
  | "sausage"
  | "drink"
  | "other";

export type AddFoodStorageLocation = "fridge" | "freezer" | "room";

export type FoodStatusSource = "backend" | "temporary_rule";

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
  status: number;
};

export type FoodProduct = Product;

export type FoodApiRecord = Partial<InventoryItem> & {
  product?: Partial<Product> | null;
  productId?: string;
  product_id?: string;
  userId?: string;
  user_id?: string;
  displayName?: string;
  display_name?: string;
  displayCategory?: AddFoodCategory;
  display_category?: AddFoodCategory;
  openedAt?: Date | string | null;
  opened_at?: Date | string | null;
  expiryDate?: Date | string;
  expiry_date?: Date | string;
  hasExplicitExpiryDate?: boolean;
  has_explicit_expiry_date?: boolean;
  createdAt?: Date | string;
  created_at?: Date | string;
  updatedAt?: Date | string;
  updated_at?: Date | string;
};

export type FoodStatusMeta = {
  status: FoodStatus;
  label: string;
  description: string;
  badgeClassName: string;
};

export type FoodItemViewModel = {
  id: string;
  userId: string;
  productId: string;
  displayName: string;
  productName?: string;
  category?: FoodCategory;
  categoryLabel: string;
  company?: string;
  barcode?: string;
  imageUrl?: string;
  openedAt?: Date | null;
  expiryDate: Date;
  hasExplicitExpiryDate: boolean;
  location: StorageLocation;
  locationLabel: string;
  status: FoodStatus;
  statusMeta: FoodStatusMeta;
  statusSource: FoodStatusSource;
  statusSourceLabel: string;
  statusExplanation: string;
  notes?: string;
  quantity?: string;
  createdAt: Date;
  updatedAt: Date;
  source: FoodDataSource;
};

export type FoodsServiceResult = {
  items: FoodItemViewModel[];
  source: FoodDataSource;
  usingMockFallback: boolean;
  error?: Error;
};

export type ListFoodsOptions = {
  signal?: AbortSignal;
  useMockFallback?: boolean;
  now?: Date;
};

export type GetFoodByIdOptions = ListFoodsOptions;

export type GetFoodByIdResult = FoodsServiceResult & {
  item: FoodItemViewModel | null;
};

export type CreateFoodInput = {
  name: string;
  category: AddFoodCategory;
  openedAt: string;
  expiryDate?: string;
  storageLocation: AddFoodStorageLocation;
  notes?: string;
};

export type CreateFoodOptions = {
  useMockFallback?: boolean;
  now?: Date;
};

export type CreateFoodResult = {
  item: FoodItemViewModel;
  source: FoodDataSource;
  usingMockFallback: boolean;
};
