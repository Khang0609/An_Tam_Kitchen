/**
 * Pillar 4: useInventoryList — useSuspenseQuery cho danh sách tủ lạnh
 *
 * Kích hoạt Suspense boundary → Skeleton screen tự động.
 * Dữ liệu lấy từ Service Layer → map sang ViewModel.
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { inventoryKeys } from "@/lib/react-query/query-keys";
import { fetchInventoryList } from "@/lib/services/inventory-service";
import { isAuthError } from "@/lib/api/client";
import { getMockFoodRecords } from "@/lib/api/mock-foods";
import { mapFoodApiRecordsToViewModels } from "@/lib/mappers/food-mapper";
import type { FoodItemViewModel, FoodDataSource } from "@/lib/api/types";

export type InventoryListData = {
  items: FoodItemViewModel[];
  source: FoodDataSource;
  usingMockFallback: boolean;
};

export function useInventoryList() {
  return useSuspenseQuery<InventoryListData>({
    queryKey: inventoryKeys.lists(),

    queryFn: async ({ signal }) => {
      const now = new Date();

      try {
        const records = await fetchInventoryList({ signal });
        return {
          items: mapFoodApiRecordsToViewModels(records, "api", now),
          source: "api" as const,
          usingMockFallback: false,
        };
      } catch (error) {
        // Auth errors should bubble up — don't mask them.
        if (isAuthError(error)) throw error;

        // Fallback to mock data when API is unavailable.
        return {
          items: mapFoodApiRecordsToViewModels(
            getMockFoodRecords(now),
            "mock",
            now
          ),
          source: "mock" as const,
          usingMockFallback: true,
        };
      }
    },
  });
}
