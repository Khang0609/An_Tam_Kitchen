import { apiRequest } from "@/lib/api/client";
import type { UserProduct } from "@repo/types";

export const USER_PRODUCT_API_ENDPOINTS = {
  create: "/api/user-products",
  list: "/api/user-products",
} as const;

export async function createUserProduct(data: {
  name: string;
  category: string;
  storageLocation: string;
  note?: string;
}) {
  return apiRequest<UserProduct>(USER_PRODUCT_API_ENDPOINTS.create, {
    method: "POST",
    body: data as unknown as Record<string, unknown>,
  });
}
