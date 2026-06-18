/**
 * Pillar 3: useAddInventoryItem — Optimistic Update & Rollback
 *
 * Full combo:
 *  onMutate  → cancelQueries → snapshot cache → setQueryData (optimistic)
 *  onError   → rollback bằng snapshot
 *  onSettled → invalidateQueries (sync truth)
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryKeys } from "@/lib/react-query/query-keys";
import { createInventoryItem } from "@/lib/services/inventory-service";
import { createUserProduct } from "@/lib/api/user-products";
import { mapFoodApiRecordToViewModel } from "@/lib/mappers/food-mapper";
import type { CreateFoodInput, FoodItemViewModel } from "@/lib/api/types";
import type { InventoryListData } from "@/hooks/queries/use-inventory-list";

type AddInventoryContext = {
  /** Snapshot of the cache before optimistic update, used for rollback */
  previousData: InventoryListData | undefined;
};

export function useAddInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation<
    FoodItemViewModel,
    Error,
    CreateFoodInput,
    AddInventoryContext
  >({
    mutationFn: async (input) => {
      // Fire both requests in parallel
      const [record] = await Promise.all([
        createInventoryItem(input),
        createUserProduct({
          name: input.name,
          category: input.category,
          storageLocation: input.storageLocation,
          note: input.notes || undefined,
        }),
      ]);

      return mapFoodApiRecordToViewModel(record, "api", new Date());
    },

    onMutate: async (input) => {
      // 1. Cancel any in-flight inventory list queries
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });

      // 2. Snapshot current cache for potential rollback
      const previousData = queryClient.getQueryData<InventoryListData>(
        inventoryKeys.lists()
      );

      // 3. Optimistically update the cache with a temporary item
      queryClient.setQueryData<InventoryListData>(
        inventoryKeys.lists(),
        (old) => {
          if (!old) return old;

          const optimisticItem = createOptimisticItem(input);

          return {
            ...old,
            items: [optimisticItem, ...old.items],
          };
        }
      );

      return { previousData };
    },

    onError: (_error, _input, context) => {
      // Rollback to the snapshot
      if (context?.previousData) {
        queryClient.setQueryData(inventoryKeys.lists(), context.previousData);
      }
    },

    onSettled: () => {
      // Always refetch to sync with server truth
      void queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

/**
 * Build a temporary FoodItemViewModel for optimistic rendering.
 * This will be replaced by the real item once onSettled fires.
 */
function createOptimisticItem(input: CreateFoodInput): FoodItemViewModel {
  const now = new Date();
  const tempId = `optimistic-${Date.now()}`;
  const openedAt = input.openedAt ? new Date(`${input.openedAt}T00:00:00`) : now;
  const expiryDate = input.expiryDate
    ? new Date(`${input.expiryDate}T00:00:00`)
    : new Date(openedAt.getTime() + 5 * 24 * 60 * 60 * 1000); // +5 days default

  return {
    id: tempId,
    userId: "",
    productId: "",
    displayName: input.name,
    categoryLabel: input.category,
    openedAt,
    expiryDate,
    hasExplicitExpiryDate: Boolean(input.expiryDate),
    location: input.storageLocation === "fridge"
      ? "fridge"
      : input.storageLocation === "freezer"
        ? "freezer"
        : "room_temp",
    locationLabel:
      input.storageLocation === "fridge"
        ? "Ngăn mát"
        : input.storageLocation === "freezer"
          ? "Ngăn đông"
          : "Nhiệt độ phòng",
    status: "fresh",
    statusMeta: {
      status: "fresh",
      label: "Còn trong thời gian khuyến nghị",
      description: "Món này vẫn nằm trong mốc tham chiếu hiện có.",
      badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    statusSource: "temporary_rule",
    statusSourceLabel: "Trạng thái tạm (optimistic)",
    statusExplanation: "Đang chờ phản hồi từ server, hiển thị dữ liệu tạm.",
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
    source: "api",
  };
}
