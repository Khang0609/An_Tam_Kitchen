"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuthErrorMessage, isAuthError } from "@/lib/api/client";
import { listFoods } from "@/lib/api/foods";
import type { FoodDataSource, FoodItemViewModel } from "@/lib/api/types";

type UseFoodsState = {
  foods: FoodItemViewModel[];
  isLoading: boolean;
  error: string | null;
  isAuthRequired: boolean;
  source: FoodDataSource | null;
  usingMockFallback: boolean;
};

export function useFoods() {
  const [state, setState] = useState<UseFoodsState>({
    foods: [],
    isLoading: true,
    error: null,
    isAuthRequired: false,
    source: null,
    usingMockFallback: false,
  });

  const loadFoods = useCallback(async (signal?: AbortSignal) => {
    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
      isAuthRequired: false,
    }));

    try {
      const result = await listFoods({ signal });
      setState({
        foods: result.items,
        isLoading: false,
        error: result.error?.message ?? null,
        isAuthRequired: false,
        source: result.source,
        usingMockFallback: result.usingMockFallback,
      });
    } catch (error) {
      const isAuthRequired = isAuthError(error);

      setState({
        foods: [],
        isLoading: false,
        error: isAuthRequired
          ? getAuthErrorMessage(error)
          : error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu thực phẩm.",
        isAuthRequired,
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
