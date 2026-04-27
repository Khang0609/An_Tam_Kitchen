import { addDays, subDays } from "date-fns";
import type { FoodCategory, StorageLocation } from "@repo/types";
import type {
  AddFoodCategory,
  AddFoodStorageLocation,
  CreateFoodInput,
  FoodApiRecord,
} from "@/lib/api/types";

const USER_ID = "0192f9a5-3c1a-7d7e-8b63-77e859c3a001";
const MOCK_STORAGE_KEY = "bep-an-tam:mock-foods";

const categoryToFoodCategory: Record<AddFoodCategory, FoodCategory> = {
  milk: "dairy",
  sauce: "sauces_spices",
  canned_food: "others",
  sausage: "meat_poultry",
  drink: "drinks",
  other: "others",
};

const storageToApiLocation: Record<AddFoodStorageLocation, StorageLocation> = {
  fridge: "fridge",
  freezer: "freezer",
  room: "room_temp",
};

const daysAfterOpenByCategory: Record<AddFoodCategory, number> = {
  milk: 5,
  sauce: 30,
  canned_food: 3,
  sausage: 4,
  drink: 3,
  other: 5,
};

export function getMockFoodRecords(now = new Date()): FoodApiRecord[] {
  return [
    {
      id: "0192f9a5-3c1a-7d7e-8b63-77e859c31001",
      userId: USER_ID,
      productId: "0192f9a5-3c1a-7d7e-8b63-77e859c32001",
      displayName: "Sữa tươi",
      openedAt: subDays(now, 4),
      expiryDate: addDays(now, 2),
      location: "fridge",
      quantity: "1 hộp",
      notes: "Dùng cho bữa sáng hoặc pha cà phê.",
      createdAt: subDays(now, 4),
      updatedAt: subDays(now, 1),
      product: {
        id: "0192f9a5-3c1a-7d7e-8b63-77e859c32001",
        name: "Sữa tươi",
        company: "An Tam Demo",
        category: "dairy",
        isGlobal: true,
        daysBeforeOpen: 7,
        daysAfterOpen: 5,
      },
    },
    {
      id: "0192f9a5-3c1a-7d7e-8b63-77e859c31002",
      userId: USER_ID,
      productId: "0192f9a5-3c1a-7d7e-8b63-77e859c32002",
      displayName: "Tương cà",
      openedAt: subDays(now, 4),
      expiryDate: addDays(now, 18),
      location: "room_temp",
      status: "fresh",
      quantity: "1 chai",
      notes: "Để ở kệ gia vị sau khi dùng.",
      createdAt: subDays(now, 4),
      updatedAt: subDays(now, 1),
      product: {
        id: "0192f9a5-3c1a-7d7e-8b63-77e859c32002",
        name: "Tương cà",
        company: "An Tam Demo",
        category: "sauces_spices",
        isGlobal: true,
        daysBeforeOpen: 180,
        daysAfterOpen: 30,
      },
    },
    {
      id: "0192f9a5-3c1a-7d7e-8b63-77e859c31003",
      userId: USER_ID,
      productId: "0192f9a5-3c1a-7d7e-8b63-77e859c32003",
      displayName: "Xúc xích",
      openedAt: subDays(now, 5),
      expiryDate: addDays(now, 1),
      location: "fridge",
      quantity: "300g",
      notes: "Đã mở gói, nên xem lại trước khi chế biến.",
      createdAt: subDays(now, 5),
      updatedAt: now,
      product: {
        id: "0192f9a5-3c1a-7d7e-8b63-77e859c32003",
        name: "Xúc xích",
        company: "An Tam Demo",
        category: "meat_poultry",
        isGlobal: true,
        daysBeforeOpen: 10,
        daysAfterOpen: 4,
      },
    },
    {
      id: "0192f9a5-3c1a-7d7e-8b63-77e859c31004",
      userId: USER_ID,
      productId: "0192f9a5-3c1a-7d7e-8b63-77e859c32004",
      displayName: "Sốt kem nấm",
      openedAt: subDays(now, 3),
      expiryDate: addDays(now, 3),
      location: "fridge",
      quantity: "1 hũ",
      notes: "Phù hợp dùng cùng mì hoặc bánh mì.",
      createdAt: subDays(now, 3),
      updatedAt: now,
      product: {
        id: "0192f9a5-3c1a-7d7e-8b63-77e859c32004",
        name: "Sốt kem nấm",
        company: "An Tam Demo",
        category: "sauces_spices",
        isGlobal: true,
        daysBeforeOpen: 90,
        daysAfterOpen: 6,
      },
    },
    {
      id: "0192f9a5-3c1a-7d7e-8b63-77e859c31005",
      userId: USER_ID,
      productId: "0192f9a5-3c1a-7d7e-8b63-77e859c32005",
      displayName: "Đậu Hà Lan đông lạnh",
      openedAt: null,
      expiryDate: addDays(now, 21),
      location: "freezer",
      status: "fresh",
      quantity: "500g",
      notes: "Để ngăn đông, đóng kín túi sau khi lấy.",
      createdAt: subDays(now, 8),
      updatedAt: subDays(now, 2),
      product: {
        id: "0192f9a5-3c1a-7d7e-8b63-77e859c32005",
        name: "Đậu Hà Lan đông lạnh",
        company: "An Tam Demo",
        category: "frozen_food",
        isGlobal: true,
        daysBeforeOpen: 180,
        daysAfterOpen: 30,
      },
    },
    ...getStoredMockFoodRecords(),
  ];
}

export function addMockFoodRecord(
  input: CreateFoodInput,
  now = new Date()
): FoodApiRecord {
  const openedAt = parseDateInput(input.openedAt) ?? now;
  const category = categoryToFoodCategory[input.category];
  const daysAfterOpen = daysAfterOpenByCategory[input.category];
  const record: FoodApiRecord = {
    id: createMockId(),
    userId: USER_ID,
    productId: createMockId(),
    displayName: input.name.trim(),
    displayCategory: input.category,
    openedAt,
    expiryDate:
      parseDateInput(input.expiryDate) ?? addDays(openedAt, daysAfterOpen),
    hasExplicitExpiryDate: Boolean(input.expiryDate),
    location: storageToApiLocation[input.storageLocation],
    quantity: "",
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
    product: {
      id: createMockId(),
      name: input.name.trim(),
      company: "Bếp An Tâm Demo",
      category,
      isGlobal: false,
      daysBeforeOpen: 0,
      daysAfterOpen,
    },
  };

  saveStoredMockFoodRecords([record, ...getStoredMockFoodRecords()]);
  return record;
}

function getStoredMockFoodRecords(): FoodApiRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const rawRecords = window.localStorage.getItem(MOCK_STORAGE_KEY);
    if (!rawRecords) return [];
    const parsed = JSON.parse(rawRecords);
    return Array.isArray(parsed) ? (parsed as FoodApiRecord[]) : [];
  } catch {
    return [];
  }
}

function saveStoredMockFoodRecords(records: FoodApiRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(records));
}

function parseDateInput(value?: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function createMockId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
