/**
 * Pillar 2: Inventory Service — pure data fetching
 *
 * This layer only handles transport: call API → return typed data.
 * No mock fallback, no ViewModel mapping, no UI logic.
 */

import { apiRequest } from "@/lib/api/client";
import type { FoodApiRecord, CreateFoodInput } from "@/lib/api/types";

const ENDPOINTS = {
  list: "/api/inventory",
  create: "/api/inventory",
  detail: (id: string) => `/api/inventory/${id}`,
  update: (id: string) => `/api/inventory/${id}`,
  delete: (id: string) => `/api/inventory/${id}`,
} as const;

// ─── Read ──────────────────────────────────────────────

export async function fetchInventoryList(options?: {
  signal?: AbortSignal;
}): Promise<FoodApiRecord[]> {
  const payload = await apiRequest<unknown>(ENDPOINTS.list, {
    method: "GET",
    signal: options?.signal,
  });

  return readFoodRecords(payload);
}

export async function fetchInventoryItem(
  id: string,
  options?: { signal?: AbortSignal }
): Promise<FoodApiRecord | null> {
  try {
    const payload = await apiRequest<unknown>(ENDPOINTS.detail(id), {
      method: "GET",
      signal: options?.signal,
    });

    return (payload as FoodApiRecord) ?? null;
  } catch {
    // Detail endpoint may not exist yet; fall back to list-filter.
    const all = await fetchInventoryList(options);
    return all.find((item) => item.id === id) ?? null;
  }
}

// ─── Write ─────────────────────────────────────────────

export async function createInventoryItem(
  input: CreateFoodInput
): Promise<FoodApiRecord> {
  const payload = await apiRequest<unknown>(ENDPOINTS.create, {
    method: "POST",
    body: input as unknown as Record<string, unknown>,
  });

  return payload as FoodApiRecord;
}

export async function deleteInventoryItem(id: string): Promise<void> {
  await apiRequest<unknown>(ENDPOINTS.delete(id), {
    method: "DELETE",
  });
}

// ─── Helpers ───────────────────────────────────────────

function readFoodRecords(payload: unknown): FoodApiRecord[] {
  if (Array.isArray(payload)) return payload as FoodApiRecord[];

  if (payload && typeof payload === "object") {
    if ("foods" in payload && Array.isArray(payload.foods)) {
      return payload.foods as FoodApiRecord[];
    }

    if (
      "inventoryItems" in payload &&
      Array.isArray(payload.inventoryItems)
    ) {
      return payload.inventoryItems as FoodApiRecord[];
    }
  }

  return [];
}
