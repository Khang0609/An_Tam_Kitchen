"use client";

import { useCallback, useEffect, useState } from "react";
import { listFoods } from "@/lib/api/foods";
import type { FoodDataSource, FoodItemViewModel } from "@/lib/api/types";

type UseFoodsState = {
  foods: FoodItemViewModel[];
  isLoading: boolean;
  error: string | null;
  source: FoodDataSource | null;
  usingMockFallback: boolean;
};

export function useFoods() {
  const [state, setState] = useState<UseFoodsState>({
    foods: [],
    isLoading: true,
    error: null,
    source: null,
    usingMockFallback: false,
  });

  const loadFoods = useCallback(async (signal?: AbortSignal) => {
    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    try {
      const result = await listFoods({ signal });
      setState({
        foods: result.items,
        isLoading: false,
        error: result.error?.message ?? null,
        source: result.source,
        usingMockFallback: result.usingMockFallback,
      });
    } catch (error) {
      setState({
        foods: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu thực phẩm.",
        source: null,
        usingMockFallback: false,
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void loadFoods(controller.signal);
    });

    return () => controller.abort();
  }, [loadFoods]);

  return {
    ...state,
    refresh: () => loadFoods(),
  };
}
