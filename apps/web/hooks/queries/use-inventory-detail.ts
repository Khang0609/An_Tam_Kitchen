/**
 * Pillar 4: useInventoryDetail — useSuspenseQuery cho chi tiết thực phẩm
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { inventoryKeys } from "@/lib/react-query/query-keys";
import { fetchInventoryItem, fetchInventoryList } from "@/lib/services/inventory-service";
import { isAuthError } from "@/lib/api/client";
import { getMockFoodRecords } from "@/lib/api/mock-foods";
import {
  mapFoodApiRecordToViewModel,
  mapFoodApiRecordsToViewModels,
} from "@/lib/mappers/food-mapper";
import type { FoodItemViewModel, FoodDataSource } from "@/lib/api/types";

export type InventoryDetailData = {
  item: FoodItemViewModel | null;
  source: FoodDataSource;
  usingMockFallback: boolean;
};

export function useInventoryDetail(id: string) {
  return useSuspenseQuery<InventoryDetailData>({
    queryKey: inventoryKeys.detail(id),

    queryFn: async ({ signal }) => {
      const now = new Date();

      try {
        const record = await fetchInventoryItem(id, { signal });

        if (!record) {
          return {
            item: null,
            source: "api" as const,
            usingMockFallback: false,
          };
        }

        return {
          item: mapFoodApiRecordToViewModel(record, "api", now),
          source: "api" as const,
          usingMockFallback: false,
        };
      } catch (error) {
        if (isAuthError(error)) throw error;

        // Fallback: search mock data for the item
        const mockRecords = getMockFoodRecords(now);
        const items = mapFoodApiRecordsToViewModels(mockRecords, "mock", now);
        const item = items.find((food) => food.id === id) ?? null;

        return {
          item,
          source: "mock" as const,
          usingMockFallback: true,
        };
      }
    },
  });
}
