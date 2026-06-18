/**
 * useProductList — TanStack Query hook cho danh sách sản phẩm
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { productKeys } from "@/lib/react-query/query-keys";
import {
  fetchProductList,
  type ProductListFilters,
} from "@/lib/services/product-service";
import type { Product } from "@repo/types";

export function useProductList(filters: ProductListFilters = {}) {
  return useSuspenseQuery<Product[]>({
    queryKey: productKeys.list(filters),

    queryFn: async ({ signal }) => {
      return fetchProductList(filters, { signal });
    },
  });
}
