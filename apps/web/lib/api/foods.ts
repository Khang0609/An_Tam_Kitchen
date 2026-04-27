import { apiRequest } from "@/lib/api/client";
import { addMockFoodRecord, getMockFoodRecords } from "@/lib/api/mock-foods";
import type {
  CreateFoodInput,
  CreateFoodOptions,
  CreateFoodResult,
  FoodApiRecord,
  FoodsServiceResult,
  GetFoodByIdOptions,
  GetFoodByIdResult,
  ListFoodsOptions,
} from "@/lib/api/types";
import {
  mapFoodApiRecordToViewModel,
  mapFoodApiRecordsToViewModels,
} from "@/lib/mappers/food-mapper";

export const FOOD_API_ENDPOINTS = {
  // TODO: Replace this provisional route once the backend publishes the
  // InventoryItem endpoint contract. The current Express API only has /health.
  listFoods: "/foods",
} as const;

export async function listFoods(
  options: ListFoodsOptions = {}
): Promise<FoodsServiceResult> {
  const { signal, useMockFallback = true, now = new Date() } = options;

  try {
    const payload = await apiRequest<unknown>(FOOD_API_ENDPOINTS.listFoods, {
      method: "GET",
      signal,
    });
    const records = readFoodRecords(payload);

    return {
      items: mapFoodApiRecordsToViewModels(records, "api", now),
      source: "api",
      usingMockFallback: false,
    };
  } catch (error) {
    if (!useMockFallback) throw error;

    return {
      items: mapFoodApiRecordsToViewModels(getMockFoodRecords(now), "mock", now),
      source: "mock",
      usingMockFallback: true,
      error: normalizeError(error),
    };
  }
}

export async function createFood(
  input: CreateFoodInput,
  options: CreateFoodOptions = {}
): Promise<CreateFoodResult> {
  const { useMockFallback = true, now = new Date() } = options;

  if (!useMockFallback) {
    throw new Error("Backend create endpoint is not available yet");
  }

  // TODO: Replace this mock write path with the backend InventoryItem create
  // endpoint once the contract is published.
  const record = addMockFoodRecord(input, now);

  return {
    item: mapFoodApiRecordToViewModel(record, "mock", now),
    source: "mock",
    usingMockFallback: true,
  };
}

export async function getFoodById(
  id: string,
  options: GetFoodByIdOptions = {}
): Promise<GetFoodByIdResult> {
  const result = await listFoods(options);

  return {
    ...result,
    item: result.items.find((food) => food.id === id) ?? null,
  };
}

function readFoodRecords(payload: unknown): FoodApiRecord[] {
  if (Array.isArray(payload)) return payload as FoodApiRecord[];

  if (payload && typeof payload === "object") {
    if ("foods" in payload && Array.isArray(payload.foods)) {
      return payload.foods as FoodApiRecord[];
    }

    if ("inventoryItems" in payload && Array.isArray(payload.inventoryItems)) {
      return payload.inventoryItems as FoodApiRecord[];
    }
  }

  return [];
}

function normalizeError(error: unknown) {
  if (error instanceof Error) return error;
  return new Error("Unable to load food data");
}
