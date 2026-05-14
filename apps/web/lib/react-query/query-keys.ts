/**
 * Pillar 1: Type-Safe Query Key Factory
 *
 * Hierarchical array keys for precise cache control.
 * Usage: queryKey: inventoryKeys.detail(id)
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

import type { InventoryItem, Product } from "@repo/types";

// ─── Inventory Filter Types ────────────────────────────

export type InventoryListFilters = {
  location?: string;
  status?: string;
};

// ─── Inventory (Tủ lạnh số) ───────────────────────────

export const inventoryKeys = {
  /** ['inventory'] — matches everything inventory */
  all: ["inventory"] as const,

  /** ['inventory', 'list'] — matches all list variants */
  lists: () => [...inventoryKeys.all, "list"] as const,

  /** ['inventory', 'list', { …filters }] — one specific list */
  list: (filters: InventoryListFilters = {}) =>
    [...inventoryKeys.lists(), filters] as const,

  /** ['inventory', 'detail'] — matches all details */
  details: () => [...inventoryKeys.all, "detail"] as const,

  /** ['inventory', 'detail', id] — one specific item */
  detail: (id: InventoryItem["id"]) =>
    [...inventoryKeys.details(), id] as const,
} as const;

// ─── Products (Sản phẩm catalog) ──────────────────────

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (filters: { global?: boolean; ownerId?: string } = {}) =>
    [...productKeys.lists(), filters] as const,

  details: () => [...productKeys.all, "detail"] as const,

  detail: (id: Product["id"]) => [...productKeys.details(), id] as const,
} as const;

// ─── Catalog (Danh mục sản phẩm toàn cục + riêng) ────

export type CatalogListFilters = {
  search?: string;
  category?: string;
  global?: boolean;
};

export const catalogKeys = {
  /** ['catalog'] — matches everything catalog */
  all: ["catalog"] as const,

  /** ['catalog', 'list'] — matches all catalog list variants */
  lists: () => [...catalogKeys.all, "list"] as const,

  /** ['catalog', 'list', { …filters }] — one specific catalog list */
  list: (filters: CatalogListFilters = {}) =>
    [...catalogKeys.lists(), filters] as const,

  /** ['catalog', 'detail'] — matches all catalog details */
  details: () => [...catalogKeys.all, "detail"] as const,

  /** ['catalog', 'detail', id] — one specific catalog item */
  detail: (id: Product["id"]) => [...catalogKeys.details(), id] as const,
} as const;

// ─── Auth ──────────────────────────────────────────────

export const authKeys = {
  all: ["auth"] as const,

  session: () => [...authKeys.all, "session"] as const,
} as const;

