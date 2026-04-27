import {
  FoodCategoryEnum,
  FoodStatusEnum,
  StorageLocationEnum,
  type FoodCategory,
  type FoodStatus,
  type Product,
  type StorageLocation,
} from "@repo/types";
import { resolveFoodStatus } from "@/lib/food-rules";
import type {
  FoodApiRecord,
  FoodDataSource,
  FoodItemViewModel,
  FoodStatusMeta,
} from "@/lib/api/types";

const LOCATION_LABELS: Record<StorageLocation, string> = {
  fridge: "Ngăn mát",
  freezer: "Ngăn đông",
  room_temp: "Nhiệt độ phòng",
};

const STATUS_META: Record<FoodStatus, Omit<FoodStatusMeta, "status">> = {
  fresh: {
    label: "Còn trong thời gian khuyến nghị",
    description: "Món này vẫn nằm trong mốc tham chiếu hiện có.",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  use_soon: {
    label: "Nên dùng sớm",
    description: "Nên ưu tiên dùng trong thời gian gần.",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-800",
  },
  check_before_use: {
    label: "Nên kiểm tra kỹ",
    description: "Nên kiểm tra cảm quan và thông tin bao bì trước khi dùng.",
    badgeClassName: "border-orange-200 bg-orange-50 text-orange-800",
  },
  not_recommended: {
    label: "Không nên để quá lâu",
    description: "Mốc tham chiếu đã vượt quá khuyến nghị hiện có.",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-800",
  },
};

export function mapFoodApiRecordToViewModel(
  record: FoodApiRecord,
  source: FoodDataSource = "api",
  now = new Date()
): FoodItemViewModel {
  const product = record.product ?? undefined;
  const expiryDate = toDate(readField(record, "expiryDate", "expiry_date"));
  const openedAt = toNullableDate(readField(record, "openedAt", "opened_at"));
  const createdAt = toDate(
    readField(record, "createdAt", "created_at"),
    new Date()
  );
  const updatedAt = toDate(
    readField(record, "updatedAt", "updated_at"),
    createdAt
  );
  const location = parseStorageLocation(record.location);
  const backendStatus = parseFoodStatus(record.status);
  const status = resolveFoodStatus(
    {
      status: backendStatus,
      openedAt,
      expiryDate,
      product: normalizeProduct(product),
    },
    now
  );

  return {
    id: String(record.id ?? ""),
    userId: String(readField(record, "userId", "user_id") ?? ""),
    productId: String(readField(record, "productId", "product_id") ?? ""),
    displayName: String(
      readField(record, "displayName", "display_name") ??
        product?.name ??
        "Sản phẩm chưa đặt tên"
    ),
    productName: product?.name,
    category: parseFoodCategory(product?.category),
    company: product?.company,
    barcode: product?.barcode,
    imageUrl: product?.imageUrl,
    openedAt,
    expiryDate,
    location,
    locationLabel: LOCATION_LABELS[location],
    status,
    statusMeta: getFoodStatusMeta(status),
    notes: record.notes,
    quantity: record.quantity,
    createdAt,
    updatedAt,
    source,
  };
}

export function mapFoodApiRecordsToViewModels(
  records: FoodApiRecord[],
  source: FoodDataSource = "api",
  now = new Date()
) {
  return records.map((record) =>
    mapFoodApiRecordToViewModel(record, source, now)
  );
}

export function getFoodStatusMeta(status: FoodStatus): FoodStatusMeta {
  return {
    status,
    ...STATUS_META[status],
  };
}

function readField<T extends object>(
  record: T,
  camelCaseKey: keyof T,
  snakeCaseKey: keyof T
) {
  return record[camelCaseKey] ?? record[snakeCaseKey];
}

function parseFoodStatus(value: unknown): FoodStatus | undefined {
  const result = FoodStatusEnum.safeParse(value);
  return result.success ? result.data : undefined;
}

function parseStorageLocation(value: unknown): StorageLocation {
  const result = StorageLocationEnum.safeParse(value);
  return result.success ? result.data : "fridge";
}

function parseFoodCategory(value: unknown): FoodCategory | undefined {
  const result = FoodCategoryEnum.safeParse(value);
  return result.success ? result.data : undefined;
}

function normalizeProduct(product?: Partial<Product> | null) {
  if (!product) return undefined;
  return {
    daysAfterOpen:
      typeof product.daysAfterOpen === "number" ? product.daysAfterOpen : 0,
  };
}

function toNullableDate(value: unknown): Date | null | undefined {
  if (value === null) return null;
  if (value === undefined) return undefined;
  return toDate(value);
}

function toDate(value: unknown, fallback?: Date): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }

  if (fallback) return fallback;
  return new Date();
}
