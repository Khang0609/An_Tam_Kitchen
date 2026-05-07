"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@repo/types";
import { listProducts } from "@/lib/api/products";

type UseProductsState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

export function useProducts(options?: { global?: boolean; ownerId?: string }) {
  const globalFilter = options?.global;
  const ownerIdFilter = options?.ownerId;

  const [state, setState] = useState<UseProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  const loadProducts = useCallback(
    async (signal?: AbortSignal) => {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const result = await listProducts({
          signal,
          global: globalFilter,
          ownerId: ownerIdFilter,
        });

        setState({
          products: result.items,
          isLoading: false,
          error: result.error?.message ?? null,
        });
      } catch (error) {
        setState({
          products: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách sản phẩm.",
        });
      }
    },
    [globalFilter, ownerIdFilter]
  );

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void loadProducts(controller.signal);
    });
    return () => controller.abort();
  }, [loadProducts]);

  return {
    ...state,
    refresh: () => loadProducts(),
  };
}
