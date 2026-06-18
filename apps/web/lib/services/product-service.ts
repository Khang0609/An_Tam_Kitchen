/**
 * Pillar 2: Product Service — pure data fetching
 */

import { apiRequest } from "@/lib/api/client";
import type { Product } from "@repo/types";

const ENDPOINTS = {
  list: "/api/products",
  detail: (id: string) => `/api/products/${id}`,
} as const;

export type ProductListFilters = {
  global?: boolean;
  ownerId?: string;
};

export async function fetchProductList(
  filters: ProductListFilters = {},
  options?: { signal?: AbortSignal }
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.global) params.set("global", "true");
  if (filters.ownerId) params.set("ownerId", filters.ownerId);

  const queryString = params.toString();
  const url = queryString ? `${ENDPOINTS.list}?${queryString}` : ENDPOINTS.list;

  const payload = await apiRequest<unknown>(url, {
    method: "GET",
    signal: options?.signal,
  });

  return Array.isArray(payload) ? (payload as Product[]) : [];
}

export async function fetchProductDetail(
  id: string,
  options?: { signal?: AbortSignal }
): Promise<Product | null> {
  try {
    const payload = await apiRequest<unknown>(ENDPOINTS.detail(id), {
      method: "GET",
      signal: options?.signal,
    });
    return (payload as Product) ?? null;
  } catch {
    return null;
  }
}
