import { apiRequest } from "@/lib/api/client";
import type { Product } from "@repo/types";
import { FOOD_API_ENDPOINTS } from "@/lib/api/foods";

export type ProductsServiceResult = {
  items: Product[];
  source: "api" | "mock";
  error?: Error;
};

/**
 * Lấy danh sách sản phẩm từ backend.
 * Hỗ trợ query params: ?global=true hoặc ?ownerId=<id>
 */
export async function listProducts(options: {
  signal?: AbortSignal;
  global?: boolean;
  ownerId?: string;
} = {}): Promise<ProductsServiceResult> {
  const { signal, global: isGlobal, ownerId } = options;

  try {
    const params = new URLSearchParams();
    if (isGlobal) params.set("global", "true");
    if (ownerId) params.set("ownerId", ownerId);

    const queryString = params.toString();
    const url = queryString
      ? `${FOOD_API_ENDPOINTS.listProducts}?${queryString}`
      : FOOD_API_ENDPOINTS.listProducts;

    const payload = await apiRequest<unknown>(url, {
      method: "GET",
      signal,
    });

    const items = Array.isArray(payload) ? payload : [];
    return { items: items as Product[], source: "api" };
  } catch (error) {
    return {
      items: [],
      source: "mock",
      error: error instanceof Error ? error : new Error("Không tải được danh sách sản phẩm."),
    };
  }
}

/**
 * Lấy thông tin chi tiết một sản phẩm theo ID.
 */
export async function getProductById(
  id: string,
  options: { signal?: AbortSignal } = {}
): Promise<Product | null> {
  try {
    const payload = await apiRequest<unknown>(`${FOOD_API_ENDPOINTS.listProducts}/${id}`, {
      method: "GET",
      signal: options.signal,
    });
    return payload as Product;
  } catch {
    return null;
  }
}
